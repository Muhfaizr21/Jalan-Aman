package crypto

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"errors"
	"fmt"
	"io"
	"strings"
)

// deriveKey256 menghasilkan kunci tepat 32-byte (256-bit) menggunakan SHA-256
func deriveKey256(secret string) []byte {
	hash := sha256.Sum256([]byte(secret))
	return hash[:]
}

// EncryptAES256GCM mengenkripsi teks menggunakan Galois/Counter Mode (Mil-Grade AES-256)
func EncryptAES256GCM(plainText string, secretKey string) (string, error) {
	if secretKey == "" {
		return "", errors.New("kunci rahasia enkripsi tidak boleh kosong")
	}

	key := deriveKey256(secretKey)
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", fmt.Errorf("gagal menginisialisasi cipher AES: %w", err)
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", fmt.Errorf("gagal menginisialisasi mode GCM: %w", err)
	}

	nonce := make([]byte, gcm.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return "", fmt.Errorf("gagal menghasilkan nonce acak: %w", err)
	}

	// Encrypt & Authenticate
	cipherBytes := gcm.Seal(nonce, nonce, []byte(plainText), nil)
	encoded := base64.StdEncoding.EncodeToString(cipherBytes)

	return fmt.Sprintf("enc:%s", encoded), nil
}

// DecryptAES256GCM mendekripsi teks ciphertext berformat enc:<base64>
func DecryptAES256GCM(cipherText string, secretKey string) (string, error) {
	if !strings.HasPrefix(cipherText, "enc:") {
		return cipherText, nil // Teks belum terenkripsi
	}

	rawB64 := strings.TrimPrefix(cipherText, "enc:")
	data, err := base64.StdEncoding.DecodeString(rawB64)
	if err != nil {
		return "", fmt.Errorf("format base64 tidak valid: %w", err)
	}

	key := deriveKey256(secretKey)
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", fmt.Errorf("gagal menginisialisasi cipher AES: %w", err)
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", fmt.Errorf("gagal menginisialisasi mode GCM: %w", err)
	}

	nonceSize := gcm.NonceSize()
	if len(data) < nonceSize {
		return "", errors.New("panjang data terenkripsi tidak memadai")
	}

	nonce, actualCipher := data[:nonceSize], data[nonceSize:]
	plainBytes, err := gcm.Open(nil, nonce, actualCipher, nil)
	if err != nil {
		return "", fmt.Errorf("gagal mendekripsi (kunci salah atau data dimanipulasi): %w", err)
	}

	return string(plainBytes), nil
}
