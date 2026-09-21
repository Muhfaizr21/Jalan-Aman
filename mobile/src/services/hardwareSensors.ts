/**
 * hardwareSensors.ts
 * Real Hardware Telemetry, Accelerometer Shock Listener, Haptics & Privacy Obfuscation.
 * Interacts directly with browser / device hardware APIs.
 */

import { Platform } from 'react-native';

export type ShockSensitivityLevel = 'low' | 'medium' | 'high';

// Ambang batas akselerasi total (m/s^2) berdasarkan kepekaan
const SHOCK_THRESHOLDS: Record<ShockSensitivityLevel, number> = {
  low: 28.0, // Hantaman tabrakan keras (> 2.8G)
  medium: 16.0, // Guncangan tajam mendadak / rem darurat (> 1.6G)
  high: 9.0, // Senggolan / getaran jalan kecil (> 0.9G)
};

export interface MotionTelemetrySample {
  x: number;
  y: number;
  z: number;
  totalG: number;
  timestamp: number;
}

class HardwareSensorsService {
  private motionListener: ((e: DeviceMotionEvent) => void) | null = null;
  private shockCallbacks: Set<(sample: MotionTelemetrySample) => void> = new Set();
  private lastShockTimestamp = 0;
  private currentSensitivity: ShockSensitivityLevel = 'medium';

  /**
   * Mengatur tingkat sensitivitas akselerometer
   */
  setSensitivity(level: ShockSensitivityLevel) {
    this.currentSensitivity = level;
  }

  /**
   * Mengaktifkan deteksi guncangan & tabrakan 3D
   */
  startMotionDetection(
    sensitivity: ShockSensitivityLevel = 'medium',
    onShockDetected?: (sample: MotionTelemetrySample) => void
  ) {
    this.currentSensitivity = sensitivity;
    if (onShockDetected) {
      this.shockCallbacks.add(onShockDetected);
    }

    if (this.motionListener) return; // Sudah aktif

    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      this.motionListener = (e: DeviceMotionEvent) => {
        const acc = e.accelerationIncludingGravity || e.acceleration;
        if (!acc) return;

        const x = acc.x || 0;
        const y = acc.y || 0;
        const z = acc.z || 0;
        const magnitude = Math.sqrt(x * x + y * y + z * z);
        const now = Date.now();

        const threshold = SHOCK_THRESHOLDS[this.currentSensitivity] || 16.0;

        // Cegah spam callback guncangan dalam 2 detik
        if (magnitude >= threshold && now - this.lastShockTimestamp > 2000) {
          this.lastShockTimestamp = now;
          const sample: MotionTelemetrySample = {
            x,
            y,
            z,
            totalG: parseFloat((magnitude / 9.8).toFixed(2)),
            timestamp: now,
          };

          this.shockCallbacks.forEach((cb) => {
            try {
              cb(sample);
            } catch (err) {
              console.warn('[Shock Callback Error]', err);
            }
          });
        }
      };

      window.addEventListener('devicemotion', this.motionListener);
    }
  }

  /**
   * Menghentikan listener sensor gerak
   */
  stopMotionDetection() {
    if (this.motionListener && typeof window !== 'undefined') {
      window.removeEventListener('devicemotion', this.motionListener);
      this.motionListener = null;
    }
    this.shockCallbacks.clear();
  }

  /**
   * Menjalankan getaran haptik jika didukung perangkat
   */
  triggerHaptic(pattern: number[] = [120, 60, 120], enabled = true) {
    if (!enabled) return;
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Abaikan jika ditolak izin browser
      }
    }
  }

  /**
   * Mengacak koordinat pelaporan (Fuzzing 75-100m) untuk menjaga privasi di Feed Komunitas
   */
  obfuscateCoordinates(
    lat: number,
    lng: number,
    enabled = true
  ): { latitude: number; longitude: number; isObfuscated: boolean } {
    if (!enabled) {
      return { latitude: lat, longitude: lng, isObfuscated: false };
    }

    // 1 derajat lintang ~ 111.000 meter
    // Radius fuzzing 75 - 100 meter
    const radiusMeters = 75 + Math.random() * 25; // 75 - 100 meter
    const angle = Math.random() * 2 * Math.PI;

    const deltaLat = (radiusMeters * Math.cos(angle)) / 111320;
    const deltaLng =
      (radiusMeters * Math.sin(angle)) / (111320 * Math.cos((lat * Math.PI) / 180));

    return {
      latitude: parseFloat((lat + deltaLat).toFixed(6)),
      longitude: parseFloat((lng + deltaLng).toFixed(6)),
      isObfuscated: true,
    };
  }

  private audioCtx: any = null;
  private sirenOsc: any = null;
  private sirenGain: any = null;
  private sirenInterval: any = null;

  /**
   * Memutar sirene darurat frekuensi tinggi (Hi-Lo warble) berbasis Web Audio API
   */
  playEmergencySiren(maxVolume = true) {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    try {
      this.stopEmergencySiren();
      const AudioCtxClass =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;

      this.audioCtx = new AudioCtxClass();
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      this.sirenOsc = this.audioCtx.createOscillator();
      this.sirenGain = this.audioCtx.createGain();

      this.sirenOsc.type = 'sawtooth';
      this.sirenOsc.frequency.setValueAtTime(850, this.audioCtx.currentTime);

      const targetGain = maxVolume ? 0.75 : 0.25;
      this.sirenGain.gain.setValueAtTime(targetGain, this.audioCtx.currentTime);

      this.sirenOsc.connect(this.sirenGain);
      this.sirenGain.connect(this.audioCtx.destination);
      this.sirenOsc.start();

      let isHighTone = false;
      this.sirenInterval = setInterval(() => {
        if (!this.sirenOsc || !this.audioCtx) return;
        const now = this.audioCtx.currentTime;
        const nextFreq = isHighTone ? 750 : 1200;
        this.sirenOsc.frequency.exponentialRampToValueAtTime(nextFreq, now + 0.2);
        isHighTone = !isHighTone;
      }, 350);
    } catch (err) {
      console.warn('[Emergency Siren Audio Error]', err);
    }
  }

  /**
   * Menghentikan audio sirene darurat
   */
  stopEmergencySiren() {
    if (this.sirenInterval) {
      clearInterval(this.sirenInterval);
      this.sirenInterval = null;
    }
    if (this.sirenOsc) {
      try {
        this.sirenOsc.stop();
        this.sirenOsc.disconnect();
      } catch {}
      this.sirenOsc = null;
    }
    if (this.sirenGain) {
      try {
        this.sirenGain.disconnect();
      } catch {}
      this.sirenGain = null;
    }
    if (this.audioCtx) {
      try {
        this.audioCtx.close();
      } catch {}
      this.audioCtx = null;
    }
  }
}

export const hardwareSensors = new HardwareSensorsService();
