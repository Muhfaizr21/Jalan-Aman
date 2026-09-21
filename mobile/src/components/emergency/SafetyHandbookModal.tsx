import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  StatusBar,
  Linking,
  Alert,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';

export interface EmergencyHotline {
  name: string;
  agency: string;
  number: string;
  category: 'polisi' | 'medis' | 'bencana' | 'sosial' | 'transportasi';
  description: string;
  color: string;
  badge: string;
}

export interface CrisisGuideline {
  id: string;
  title: string;
  subtitle: string;
  category: 'kriminal' | 'pelecehan' | 'medis' | 'jalanan';
  color: string;
  steps: {
    priority: number;
    action: string;
    detail: string;
    highlight?: boolean;
  }[];
  criticalDoNot: string[];
}

interface SafetyHandbookModalProps {
  visible: boolean;
  onDismiss: () => void;
  initialTab?: 'hotlines' | 'guidelines';
}

/* Vector Icons */
function ArrowBackIcon({ size = 22, color = '#0F172A' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function SearchIcon({ size = 18, color = '#94A3B8' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth={2} />
      <Path d="M21 21l-4.35-4.35" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function PhoneCallIcon({ size = 18, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function BookOpenIcon({ size = 20, color = '#0F172A' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ShieldAlertIcon({ size = 20, color = '#DC2626' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 8v4M12 16h.01" stroke={color} strokeWidth={2.4} strokeLinecap="round" />
    </Svg>
  );
}

function ChevronDownIcon({ size = 18, color = '#64748B' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ChevronUpIcon({ size = 18, color = '#64748B' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 15l-6-6-6 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function AlertTriangleIcon({ size = 16, color = '#EF4444' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 9v4M12 17h.01" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function CheckCircleIcon({ size = 16, color = '#10B981' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
      <Path d="M8 12l2.5 2.5L16 9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

const OFFICIAL_HOTLINES: EmergencyHotline[] = [
  {
    name: 'Kepolisian Negara RI',
    agency: 'POLRI',
    number: '110',
    category: 'polisi',
    description: 'Laporan tindak kriminalitas, ancaman kekerasan fisik, begal, dan kecelakaan lalu lintas.',
    color: '#1E3A8A',
    badge: 'Bebas Pulsa 24 Jam',
  },
  {
    name: 'Gawat Darurat Medis & Ambulans',
    agency: 'Kemenkes RI SPGDT',
    number: '119',
    category: 'medis',
    description: 'Ambulans penjemputan trauma kecelakaan, henti jantung, pendarahan berat, dan rujukan RS.',
    color: '#DC2626',
    badge: 'Bebas Pulsa 24 Jam',
  },
  {
    name: 'Pemadam Kebakaran & Evakuasi',
    agency: 'DAMKAR Reskue',
    number: '113',
    category: 'bencana',
    description: 'Kebakaran fasilitas, evakuasi penyelamatan darurat, pohon tumbang, korsleting listrik kabel jalan.',
    color: '#EA580C',
    badge: 'Bebas Pulsa 24 Jam',
  },
  {
    name: 'Pencarian & Pertolongan',
    agency: 'BASARNAS',
    number: '115',
    category: 'bencana',
    description: 'Bencana banjir bandang genangan jalan ekstrem, evakuasi runtuhan bangunan, tanah longsor.',
    color: '#D97706',
    badge: 'Respon Cepat 24 Jam',
  },
  {
    name: 'Posko Perlindungan Perempuan & Anak',
    agency: 'SAPA 129 (KemenPPPA)',
    number: '129',
    category: 'sosial',
    description: 'Bantuan hukum, pendampingan darurat kekerasan seksual, pelecehan di fasilitas umum & KDRT.',
    color: '#9333EA',
    badge: 'Hotline Terpadu 129',
  },
  {
    name: 'Patroli Jalan Tol & Derek Resmi',
    agency: 'Jasa Marga',
    number: '14080',
    category: 'transportasi',
    description: 'Kendaraan mogok, kecelakaan tol dalam & lingkar luar Jakarta, gangguan keamanan jalan tol.',
    color: '#0284C7',
    badge: 'Derek Resmi 24 Jam',
  },
];

const CRISIS_GUIDELINES: CrisisGuideline[] = [
  {
    id: 'stalking',
    title: 'Merasa Dibuntuti di Jalan Sepi',
    subtitle: 'Langkah taktis pencegahan konfrontasi & perpindahan ke zona aman',
    category: 'jalanan',
    color: '#EA580C',
    steps: [
      {
        priority: 1,
        action: 'Jaga Ketenangan & Percepat Langkah Teratur',
        detail: 'Hindari panik berlari histeris yang memicu pelaku mengejar. Atur ritme langkah cepat dan seberangi jalan ke sisi seberang untuk memastikan apakah orang tersebut benar-benar mengikuti.',
        highlight: true,
      },
      {
        priority: 2,
        action: 'Gunakan Ponsel Secara Taktis',
        detail: 'Pura-pura menelpon seseorang dengan suara tegas: "Aku sudah di depan minimarket nih, kamu sudah keluar jemput kan?". Nyalakan live sharing lokasi atau buka fitur SOS JalanAman.',
      },
      {
        priority: 3,
        action: 'Belok Langsung ke Safe Haven Terdekat',
        detail: 'Jangan langsung pulang ke rumah atau kamar kos jika sendirian (karena pelaku akan mengetahui alamat tempat tinggal). Masuki minimarket 24 jam, pos satpam komplek, atau SPBU terdekat.',
        highlight: true,
      },
      {
        priority: 4,
        action: 'Bila Pelaku Berani Mendekat, Bunyikan Alarm',
        detail: 'Aktifkan sirene SOS di ponsel Anda. Jika harus berteriak meminta tolong, teriakan kata "KEBAKARAN!" atau "RAMPOK!" terbukti secara psikologis menarik perhatian warga sekitar lebih cepat.',
      },
    ],
    criticalDoNot: [
      'JANGAN belok ke gang sempit buntu atau lorong remang-remang.',
      'JANGAN memakai headphone / headset dengan volume penuh yang mematikan kewaspadaan telinga.',
      'JANGAN masuk ke rumah atau membuka pagar sendiri jika pelaku masih berada tepat di belakang Anda.',
    ],
  },
  {
    id: 'robbery',
    title: 'Menghadapi Begal / Ancaman Senjata',
    subtitle: 'Protokol de-eskalasi keselamatan nyawa saat todongan kriminal',
    category: 'kriminal',
    color: '#DC2626',
    steps: [
      {
        priority: 1,
        action: 'Utamakan Nyawa, Bukan Materi',
        detail: 'Motor, ponsel, dan barang berharga dapat diganti, nyawa Anda tidak tergantikan. Pelaku begal seringkali dalam pengaruh obat/panik, jangan pernah memicu agresi berlebih.',
        highlight: true,
      },
      {
        priority: 2,
        action: 'Angkat Tangan Terbuka Setinggi Dada',
        detail: 'Tunjukkan telapak tangan terbuka dan patuhi instruksi serah barang secara perlahan. Katakan dengan jelas sebelum bergerak: "Saya ambil dompet di kantong ya, jangan melukai saya".',
      },
      {
        priority: 3,
        action: 'Amati Ciri Pelaku Tanpa Menatap Menantang',
        detail: 'Hindari kontak mata tajam yang dianggap menantang. Curi pandang ke atribut khusus: pelat nomor motor, model helm/jaket, tato/bekas luka, perkiraan tinggi badan, dan logat bicara.',
      },
      {
        priority: 4,
        action: 'Lapor Segera Begitu Pelaku Kabur',
        detail: 'Segera dekati rumah warga terdekat, hubungi 110 atau tekan SOS Polisi di aplikasi JalanAman agar patroli polisi di radius sekitar segera menyekat rute pelarian.',
        highlight: true,
      },
    ],
    criticalDoNot: [
      'JANGAN melakukan perlawanan fisik sendirian jika pelaku memegang senjata tajam atau senjata api.',
      'JANGAN membuat gerakan mendadak ke dalam jaket yang disangka pelaku Anda mengambil senjata tandingan.',
      'JANGAN mengejar pelaku sendirian setelah kejadian.',
    ],
  },
  {
    id: 'harassment',
    title: 'Pelecehan di Angkutan Umum',
    subtitle: 'Tindakan penegasan batas & penindakan pelaku di KRL / TransJakarta',
    category: 'pelecehan',
    color: '#9333EA',
    steps: [
      {
        priority: 1,
        action: 'Tegur dengan Suara Jelas & Lantang',
        detail: 'Pelaku pelecehan mengandalkan rasa malu korban untuk menutupi aksinya. Katakan tegas: "Tangan Anda tolong dijauhkan, jangan menyentuh saya!". Ini langsung mengarahkan perhatian penumpang lain.',
        highlight: true,
      },
      {
        priority: 2,
        action: 'Pindah Posisi & Minta Dukungan Sekitar',
        detail: 'Segera bergeser ke dekat pengawas/penumpang lain. Di KRL, geser ke arah pintu atau gerbong wanita bila ada. Mintalah tolong: "Mbak/Mas, tolong dampingi saya, orang ini barusan melecehkan saya".',
      },
      {
        priority: 3,
        action: 'Lapor Petugas Keamanan Dalam (PKD) / Pengemudi',
        detail: 'Beri kode ke kondektur armada atau laporkan saat tiba di halte/stasiun berikutnya. Petugas KAI Commuter dan TransJakarta memiliki SOP penahanan pelaku di pos stasiun.',
        highlight: true,
      },
      {
        priority: 4,
        action: 'Hubungi Hotline SAPA 129',
        detail: 'SAPA 129 menyediakan pendampingan psikologis dan bantuan hukum terpadu jika Anda ingin memproses pelaku secara pidana.',
      },
    ],
    criticalDoNot: [
      'JANGAN merasa bersalah atau menganggap ini kesalahan pakaian/gerak Anda.',
      'JANGAN berdiam diri membiarkan pelaku terus mengulangi perbuatannya ke korban lain.',
    ],
  },
  {
    id: 'firstaid',
    title: 'P3K Darurat: Henti Pendarahan & Syok',
    subtitle: 'Pertolongan pertama penyelamatan korban kecelakaan lalu lintas',
    category: 'medis',
    color: '#059669',
    steps: [
      {
        priority: 1,
        action: 'Amankan Diri Sendiri & Lokasi Kejadian',
        detail: 'Pastikan lalu lintas berhenti atau diarahkan menjauh sebelum mendekati korban, agar Anda tidak menjadi korban tabrakan susulan. Pasang segitiga pengaman / nyalakan lampu hazard.',
      },
      {
        priority: 2,
        action: 'Tekan Langsung Sumber Pendarahan (Direct Pressure)',
        detail: 'Gunakan kain bersih, pakaian, atau kasa tebal. Tekan kuat-kuat tepat di atas sumber luka pendarahan tanpa dilepas selama minimal 10-15 menit. Bila tembus darah, tambahkan kain di atasnya tanpa mencabut kain pertama.',
        highlight: true,
      },
      {
        priority: 3,
        action: 'Tangani Gejala Syok Sirkulasi',
        detail: 'Bila korban tampak pucat, bibir membiru, dingin berkeringat dingin, baringkan terlentang dan tinggikan tungkai kaki sekitar 30 cm dari permukaan tanah (selama tidak ada patah tulang panggul/punggung). Selimuti korban agar hangat.',
        highlight: true,
      },
      {
        priority: 4,
        action: 'Hubungi Ambulans 119 Segera',
        detail: 'Sampaikan lokasi detail titik kejadian, jumlah korban, kondisi kesadaran korban, dan jenis pendarahan yang dialami agar tim medis membawa peralatan resusitasi tepat sasaran.',
      },
    ],
    criticalDoNot: [
      'JANGAN mencabut helm korban kecelakaan motor jika dicurigai cedera leher/tulang belakang kecuali korban tidak bernapas.',
      'JANGAN memberi makan atau minum kepada korban yang pingsan atau setengah sadar (bisa tersedak masuk ke paru-paru).',
      'JANGAN mengikat tourniquet kencang sembarangan kecuali pendarahan arteri besar anggota badan yang tidak berhenti ditekan.',
    ],
  },
];

export const SafetyHandbookModal: React.FC<SafetyHandbookModalProps> = ({
  visible,
  onDismiss,
  initialTab = 'hotlines',
}) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'hotlines' | 'guidelines'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGuidelineId, setExpandedGuidelineId] = useState<string | null>('stalking');

  const filteredHotlines = useMemo(() => {
    if (!searchQuery.trim()) return OFFICIAL_HOTLINES;
    const query = searchQuery.toLowerCase();
    return OFFICIAL_HOTLINES.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.agency.toLowerCase().includes(query) ||
        item.number.includes(query) ||
        item.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const filteredGuidelines = useMemo(() => {
    if (!searchQuery.trim()) return CRISIS_GUIDELINES;
    const query = searchQuery.toLowerCase();
    return CRISIS_GUIDELINES.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.subtitle.toLowerCase().includes(query) ||
        item.steps.some(
          (s) =>
            s.action.toLowerCase().includes(query) ||
            s.detail.toLowerCase().includes(query)
        )
    );
  }, [searchQuery]);

  const handleCallNumber = (hotline: EmergencyHotline) => {
    Alert.alert(
      `Panggil ${hotline.agency} (${hotline.number})?`,
      `Anda akan terhubung langsung ke operator ${hotline.name}. Pastikan sinyal telepon aktif.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Panggil Sekarang',
          style: 'destructive',
          onPress: () => {
            Linking.openURL(`tel:${hotline.number}`).catch(() => {
              Alert.alert('Gagal Melakukan Panggilan', `Silakan tekan manual ${hotline.number} pada keypad telepon.`);
            });
          },
        },
      ]
    );
  };

  const toggleGuideline = (id: string) => {
    setExpandedGuidelineId((prev) => (prev === id ? null : id));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onDismiss}
    >
      <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onDismiss}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Tutup Buku Saku"
          >
            <ArrowBackIcon size={20} />
          </TouchableOpacity>

          <View style={styles.headerTitleWrap}>
            <View style={styles.headerIconTag}>
              <BookOpenIcon size={16} color="#0EA5E9" />
              <Text style={styles.headerTagText}>OFFLINE READY</Text>
            </View>
            <Text style={styles.headerTitle}>Buku Saku &amp; Direktori Darurat</Text>
          </View>
        </View>

        {/* Subtitle / Description */}
        <View style={styles.subHeaderWrap}>
          <Text style={styles.subHeaderText}>
            Protokol mitigasi krisis, SOP tindakan saat terancam, &amp; panggilan langsung hotline resmi nasional.
          </Text>
        </View>

        {/* Quick Search Input */}
        <View style={styles.searchBox}>
          <SearchIcon size={18} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari hotline (misal: 110, 119) atau topik (misal: begal, luka)..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>

        {/* Segmented Control Switch */}
        <View style={styles.segmentedContainer}>
          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'hotlines' && styles.segmentBtnActive]}
            onPress={() => setActiveTab('hotlines')}
            activeOpacity={0.8}
          >
            <PhoneCallIcon size={15} color={activeTab === 'hotlines' ? '#0EA5E9' : '#64748B'} />
            <Text style={[styles.segmentText, activeTab === 'hotlines' && styles.segmentTextActive]}>
              Hotline Cepat ({filteredHotlines.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'guidelines' && styles.segmentBtnActive]}
            onPress={() => setActiveTab('guidelines')}
            activeOpacity={0.8}
          >
            <ShieldAlertIcon size={15} color={activeTab === 'guidelines' ? '#DC2626' : '#64748B'} />
            <Text style={[styles.segmentText, activeTab === 'guidelines' && styles.segmentTextActive]}>
              Panduan Taktis ({filteredGuidelines.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Scroll View */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollBody, { paddingBottom: insets.bottom + 32 }]}
        >
          {activeTab === 'hotlines' ? (
            <View style={styles.hotlinesSection}>
              <View style={styles.sectionInfoBanner}>
                <CheckCircleIcon size={16} color="#0284C7" />
                <Text style={styles.sectionInfoText}>
                  Nomor hotline resmi pemerintah &amp; instansi operasional 24 jam bebas pulsa.
                </Text>
              </View>

              {filteredHotlines.map((hotline) => (
                <View key={hotline.number} style={styles.hotlineCard}>
                  <View style={styles.hotlineHeader}>
                    <View style={styles.hotlineInfoCol}>
                      <View style={styles.agencyBadgeRow}>
                        <View style={[styles.agencyTag, { backgroundColor: hotline.color }]}>
                          <Text style={styles.agencyTagText}>{hotline.agency}</Text>
                        </View>
                        <Text style={styles.hotlineBadgeText}>{hotline.badge}</Text>
                      </View>
                      <Text style={styles.hotlineName}>{hotline.name}</Text>
                    </View>

                    <View style={[styles.numberDisplayBox, { borderColor: hotline.color }]}>
                      <Text style={[styles.numberDisplayText, { color: hotline.color }]}>
                        {hotline.number}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.hotlineDesc}>{hotline.description}</Text>

                  <TouchableOpacity
                    style={[styles.callActionButton, { backgroundColor: hotline.color }]}
                    onPress={() => handleCallNumber(hotline)}
                    activeOpacity={0.85}
                    accessibilityRole="button"
                    accessibilityLabel={`Panggil ${hotline.name} nomor ${hotline.number}`}
                  >
                    <PhoneCallIcon size={16} />
                    <Text style={styles.callActionButtonText}>
                      Hubungi {hotline.number} ({hotline.agency})
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}

              {filteredHotlines.length === 0 && (
                <View style={styles.emptySearchWrap}>
                  <Text style={styles.emptyTitle}>Hotline tidak ditemukan</Text>
                  <Text style={styles.emptySubtitle}>Coba kata kunci lain atau kosongkan kolom pencarian.</Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.guidelinesSection}>
              <View style={styles.sectionInfoBanner}>
                <ShieldAlertIcon size={16} color="#DC2626" />
                <Text style={styles.sectionInfoText}>
                  SOP pertahanan diri &amp; mitigasi bahaya jalanan disusun bersama konsultan keamanan publik.
                </Text>
              </View>

              {filteredGuidelines.map((guideline) => {
                const isExpanded = expandedGuidelineId === guideline.id;

                return (
                  <View key={guideline.id} style={styles.guidelineCard}>
                    <TouchableOpacity
                      style={styles.guidelineHeaderBtn}
                      onPress={() => toggleGuideline(guideline.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.guidelineTitleCol}>
                        <View style={styles.guidelineTagRow}>
                          <View style={[styles.categoryPill, { backgroundColor: `${guideline.color}15` }]}>
                            <Text style={[styles.categoryPillText, { color: guideline.color }]}>
                              {guideline.category.toUpperCase()}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.guidelineTitle}>{guideline.title}</Text>
                        <Text style={styles.guidelineSubtitle}>{guideline.subtitle}</Text>
                      </View>

                      <View style={styles.expandChevronBox}>
                        {isExpanded ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />}
                      </View>
                    </TouchableOpacity>

                    {isExpanded && (
                      <View style={styles.guidelineBody}>
                        <View style={styles.dividerLine} />

                        {/* SOP Step List */}
                        <Text style={styles.bodySectionTitle}>PROSEDUR TINDAKAN TEPAT (SOP):</Text>
                        <View style={styles.stepList}>
                          {guideline.steps.map((step) => (
                            <View
                              key={step.priority}
                              style={[
                                styles.stepItemCard,
                                step.highlight && styles.stepItemCardHighlight,
                              ]}
                            >
                              <View style={styles.stepNumberBadge}>
                                <Text style={styles.stepNumberBadgeText}>{step.priority}</Text>
                              </View>
                              <View style={styles.stepTextCol}>
                                <Text style={styles.stepActionText}>{step.action}</Text>
                                <Text style={styles.stepDetailText}>{step.detail}</Text>
                              </View>
                            </View>
                          ))}
                        </View>

                        {/* Critical Do NOTs */}
                        <View style={styles.criticalDoNotBox}>
                          <View style={styles.criticalDoNotHeader}>
                            <AlertTriangleIcon size={16} />
                            <Text style={styles.criticalDoNotTitle}>JANGAN LAKUKAN (RISIKO TINGGI):</Text>
                          </View>
                          {guideline.criticalDoNot.map((item, idx) => (
                            <View key={idx} style={styles.criticalBulletRow}>
                              <Text style={styles.criticalBulletDot}>✕</Text>
                              <Text style={styles.criticalBulletText}>{item}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}

              {filteredGuidelines.length === 0 && (
                <View style={styles.emptySearchWrap}>
                  <Text style={styles.emptyTitle}>Panduan tidak ditemukan</Text>
                  <Text style={styles.emptySubtitle}>Coba cari dengan istilah lain seperti "begal", "luka", atau "krl".</Text>
                </View>
              )}
            </View>
          )}

          {/* Offline Security Guarantee Footer */}
          <View style={styles.offlineFooterBox}>
            <Text style={styles.offlineFooterText}>
              🛡️ Semua SOP dan direktori hotline ini disimpan lokal di memori perangkat JalanAman Anda. Seluruh konten tetap dapat dibaca secara penuh meskipun Anda berada di area tanpa sinyal seluler atau kuota internet.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default SafetyHandbookModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerTitleWrap: {
    flex: 1,
    gap: 2,
  },
  headerIconTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  subHeaderWrap: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  subHeaderText: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    height: '100%',
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    padding: 3,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 9,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentTextActive: {
    color: '#0F172A',
    fontWeight: '800',
  },
  scrollBody: {
    paddingHorizontal: 16,
    gap: 12,
  },
  sectionInfoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F1F5F9',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  sectionInfoText: {
    fontSize: 11.5,
    color: '#475569',
    flex: 1,
    lineHeight: 16,
  },
  hotlinesSection: {
    gap: 12,
  },
  hotlineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  hotlineHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  hotlineInfoCol: {
    flex: 1,
    gap: 4,
  },
  agencyBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  agencyTag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  agencyTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  hotlineBadgeText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#64748B',
  },
  hotlineName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  numberDisplayBox: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1.5,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberDisplayText: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  hotlineDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
  },
  callActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    borderRadius: 12,
  },
  callActionButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  guidelinesSection: {
    gap: 12,
  },
  guidelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  guidelineHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    gap: 12,
  },
  guidelineTitleCol: {
    flex: 1,
    gap: 4,
  },
  guidelineTagRow: {
    flexDirection: 'row',
  },
  categoryPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryPillText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  guidelineTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  guidelineSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
  },
  expandChevronBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guidelineBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 4,
  },
  bodySectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.4,
  },
  stepList: {
    gap: 8,
  },
  stepItemCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepItemCardHighlight: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  stepNumberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumberBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  stepTextCol: {
    flex: 1,
    gap: 3,
  },
  stepActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  stepDetailText: {
    fontSize: 11.5,
    color: '#475569',
    lineHeight: 16,
  },
  criticalDoNotBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 6,
    marginTop: 4,
  },
  criticalDoNotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  criticalDoNotTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 0.3,
  },
  criticalBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  criticalBulletDot: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DC2626',
    marginTop: 1,
  },
  criticalBulletText: {
    fontSize: 11,
    color: '#991B1B',
    flex: 1,
    lineHeight: 15,
  },
  emptySearchWrap: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  offlineFooterBox: {
    backgroundColor: '#F1F5F9',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
  },
  offlineFooterText: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },
});
