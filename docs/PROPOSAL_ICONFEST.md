SISTEM REKOMENDASI RUTE TERAMAN DARI TINDAK
KRIMINALITAS BERBASIS SPATIAL DATA ANALYSIS
DAN ALGORITMA MACHINE LEARNING
Disusun oleh:
UNSIL KAMI DATANG
Anggota:
Ayip Muhammad (2305059)
Muhammad Faiz Ramadhan (2305072)
Muhammad Ihya ‘Ulumuddin (2305073)
SOFTWARE DEVELOPMENT COMPETITION
ICONFEST
2026
KATA PENGANTAR
DAFTAR ISI
*Buat daftar isi sesuai dengan heading yang sudah dibuat. Format sub-heading dibebaskan
kepada peserta, dan dibebaskan untuk menambahkan bagian-bagian seperti sub-heading baru
dan lampiran lainnya apabila diperlukan. (gunakan penomoran halaman pada setiap
halaman).
ABSTRAK
BAB I
PENDAHULUAN
1.1 Latar Belakang
Mobilitas masyarakat pada malam hingga dini hari terus meningkat seiring
dengan tuntutan aktivitas ekonomi dan sosial yang berlangsung hingga larut malam,
namun peningkatan ini justru berjalan beriringan dengan ancaman kejahatan jalanan
yang kian meresahkan. Data Pusiknas Bareskrim Polri (2024) mengungkap bahwa aksi
begal dan pencurian dengan kekerasan paling sering terjadi pada rentang pukul 00.00
hingga 04.59 dini hari, saat kondisi jalan relatif sepi dan pengawasan minim. Di
wilayah hukum Polda Metro Jaya saja, tercatat 25 kasus begal dan curas hanya dalam
lima belas hari pertama bulan Mei 2024, sebuah angka yang menandakan kejahatan
jalanan terjadi hampir setiap hari dan menuntut respons teknologi yang jauh lebih
adaptif dibanding kebijakan konvensional.
Sayangnya, aplikasi navigasi yang digunakan masyarakat luas saat ini masih
dirancang dengan paradigma optimasi jarak terpendek dan waktu tempuh tercepat
semata. Sistem semacam ini pada dasarnya buta terhadap dimensi keamanan, sehingga
pengguna dapat saja diarahkan melintasi gang sepi atau titik rawan kriminalitas tanpa
peringatan apa pun. Kesenjangan ini telah diidentifikasi sejumlah peneliti yang
mendorong pengembangan algoritma rute alternatif yang turut memasukkan variabel
risiko kejahatan sebagai bobot tambahan dalam proses pencarian jalur (Hossain et al.,
2022).
Untuk menutup kesenjangan tersebut, pendekatan yang lebih dinamis dan
berbasis komunitas menjadi krusial. Skema crowdsourcing memungkinkan masyarakat
saling melaporkan kondisi jalan secara real-time, sementara analisis data spasial
historis membantu mengungkap pola sebaran kejahatan yang konsisten dari waktu ke
waktu. Penelitian di Indonesia menunjukkan bahwa metode klasterisasi spasial mampu
memetakan wilayah rawan kriminalitas secara akurat berdasarkan data kepolisian
(Gustriansyah et al., 2022), sementara pendekatan pembelajaran mesin berbasis fitur
lingkungan urban terbukti mampu memprediksi titik rawan kejahatan dengan akurasi
tinggi hingga 89,7 persen (Kim et al., 2024).
Berangkat dari kebutuhan tersebut, penelitian ini mengusulkan sistem “Jalan
Aman” sebagai solusi rekomendasi rute teraman berbasis crowdsourcing dan
kecerdasan buatan. Laporan masyarakat mengenai insiden kriminal dan kondisi jalan
dikumpulkan lalu dikelompokkan menggunakan algoritma DBSCAN untuk
mengidentifikasi klaster titik rawan secara dinamis. Tingkat bahaya pada tiap ruas jalan
kemudian diprediksi menggunakan algoritma Random Forest yang
mempertimbangkan faktor waktu, riwayat insiden, dan kondisi lingkungan sekitar.
Hasil prediksi ini selanjutnya diintegrasikan ke dalam algoritma A-Star yang bobot
edge-nya telah dimodifikasi, sehingga pencarian rute tidak lagi hanya mengejar jarak
terpendek, melainkan juga meminimalkan paparan pengguna terhadap risiko kejahatan
sepanjang perjalanan.
1.2 Rumusan Masalah
Berdasarkan latar belakang di atas, dapat dirumuskan permasalahan penelitian
sebagai berikut:
1. Bagaimana merancang mekanisme crowdsourcing yang memungkinkan
masyarakat melaporkan insiden kriminal dan kondisi jalan secara real-time
sebagai sumber data utama sistem?
2. Bagaimana menerapkan algoritma DBSCAN untuk mengidentifikasi dan
mengelompokkan klaster titik rawan kejahatan secara dinamis dari data laporan
yang terkumpul?
3. Bagaimana merancang model prediksi tingkat bahaya pada tiap ruas jalan
menggunakan algoritma Random Forest dengan mempertimbangkan faktor
waktu, riwayat insiden, dan kondisi lingkungan sekitar?
4. Bagaimana memodifikasi bobot edge pada algoritma A-Star agar mampu
mengintegrasikan skor risiko kejahatan ke dalam proses pencarian rute,
sehingga rute yang dihasilkan tidak hanya optimal dari segi jarak/waktu
tempuh, tetapi juga meminimalkan paparan risiko keamanan?
5. Bagaimana tingkat akurasi dan efektivitas sistem "Jalan Aman" dalam
merekomendasikan rute teraman dibandingkan dengan aplikasi navigasi
konvensional yang hanya berbasis jarak terpendek?
1.3 Tujuan Project
Berdasarkan rumusan masalah tersebut, tujuan dari penelitian ini adalah:
1. Merancang dan mengimplementasikan mekanisme crowdsourcing berbasis
laporan masyarakat untuk mengumpulkan data insiden kriminal dan kondisi
jalan secara real-time.
2. Mengimplementasikan algoritma DBSCAN untuk mengidentifikasi klaster titik
rawan kriminalitas secara dinamis berdasarkan data spasial historis dan laporan
crowdsourcing.
3. Membangun model prediksi tingkat bahaya (risk scoring) pada tiap ruas jalan
menggunakan algoritma Random Forest dengan variabel waktu, riwayat
insiden, dan fitur lingkungan urban.
4. Mengembangkan modifikasi algoritma A-Star dengan bobot edge yang
mengintegrasikan skor risiko kejahatan, sehingga sistem dapat
merekomendasikan rute yang meminimalkan paparan risiko kejahatan, bukan
sekadar rute tercepat atau terpendek.
5. Mengevaluasi kinerja sistem "Jalan Aman" melalui pengujian akurasi prediksi
risiko serta perbandingan rute yang dihasilkan dengan aplikasi navigasi
konvensional.
1.4 Manfaat Project
1. Bagi masyarakat, sistem ini dapat menjadi alat bantu navigasi yang
meningkatkan rasa aman saat beraktivitas pada malam hingga dini hari dengan
menghindari jalur rawan kejahatan.
2. Bagi pihak kepolisian dan pemangku kebijakan, data agregat dari sistem dapat
dimanfaatkan sebagai bahan pertimbangan dalam penentuan patroli atau
pengawasan pada titik-titik rawan kejahatan.
3. Bagi pengembang teknologi, sistem ini dapat menjadi purwarupa (prototype)
yang dapat dikembangkan lebih lanjut menjadi fitur tambahan pada aplikasi
navigasi komersial yang sudah ada.
4. Bagi akademisi dan mahasiswa, penelitian ini dapat menjadi studi kasus
penerapan kombinasi algoritma clustering, machine learning, dan pathfinding
dalam menyelesaikan permasalahan sosial nyata.
BAB II
DESKRIPSI PROJECT
2.1 Deskripsi Project
Jalan Aman adalah sistem rekomendasi rute cerdas yang dirancang khusus untuk
menjawab kebutuhan mendasar masyarakat urban akan rasa aman saat bepergian,
terutama pada rentang waktu malam hingga dini hari. Berbeda dengan aplikasi navigasi
konvensional yang hanya berfokus pada efisiensi jarak dan waktu tempuh, Jalan Aman
menghadirkan dimensi baru dalam pengalaman bernavigasi dengan menjadikan tingkat
keamanan sebagai variabel utama dalam penentuan rute. Sistem ini bekerja dengan
menggabungkan tiga pilar teknologi utama, yaitu partisipasi aktif masyarakat melalui
skema crowdsourcing, analisis data spasial untuk memetakan pola kerawanan wilayah,
serta kecerdasan buatan untuk memprediksi dan mengantisipasi potensi ancaman di
sepanjang jalur perjalanan pengguna.
Secara konsep, Jalan Aman berfungsi layaknya "peta hidup" yang terus
diperbarui oleh kontribusi penggunanya sendiri. Setiap laporan insiden, baik berupa
tindak kriminal, kondisi jalan yang minim penerangan, maupun titik-titik yang dirasa
mencurigakan, akan diolah oleh sistem untuk membentuk pemahaman kolektif tentang
tingkat risiko suatu area pada waktu tertentu. Data ini kemudian diproses melalui
rangkaian algoritma cerdas, mulai dari pengelompokan wilayah rawan hingga prediksi
tingkat bahaya, sebelum akhirnya diterjemahkan menjadi rekomendasi rute yang tidak
hanya mempertimbangkan jarak terpendek, tetapi juga jalur teraman yang dapat
ditempuh pengguna.
Pada akhirnya, Jalan Aman hadir bukan sekadar sebagai aplikasi penunjuk arah,
melainkan sebagai ekosistem keamanan kolaboratif yang melibatkan masyarakat
sebagai mata dan telinga bersama di jalanan. Dengan pendekatan ini, setiap pengguna
tidak lagi menjadi objek pasif yang mengikuti arahan sistem secara membabi buta,
melainkan turut menjadi bagian dari solusi yang membuat perjalanan malam hari terasa
lebih aman, lebih terinformasi, dan lebih dapat diandalkan.
2.2 Permasalahan dan Urgensi Project
Peningkatan mobilitas masyarakat pada malam hingga dini hari yang tidak
diimbangi dengan sistem keamanan yang memadai telah menciptakan kerentanan
tersendiri bagi para pejalan kaki maupun pengendara. Data Pusiknas Bareskrim Polri
(2024) mencatat bahwa aksi begal dan pencurian dengan kekerasan paling sering
terjadi pada rentang pukul 00.00 hingga 04.59 dini hari, saat kondisi jalan relatif sepi
dan pengawasan minim. Kondisi ini semakin diperparah oleh temuan di wilayah
hukum Polda Metro Jaya, di mana tercatat 25 kasus begal dan curas hanya dalam lima
belas hari pertama bulan Mei 2024, sebuah angka yang menunjukkan bahwa kejahatan
jalanan bukan lagi kejadian sporadis, melainkan ancaman yang berlangsung hampir
setiap hari.
Ironisnya, di tengah tingginya angka kejahatan tersebut, teknologi navigasi yang
digunakan masyarakat luas saat ini justru belum berpihak pada aspek keselamatan
penggunanya. Aplikasi navigasi konvensional masih dirancang dengan paradigma
optimasi jarak terpendek dan waktu tempuh tercepat semata, sehingga secara sistemik
buta terhadap dimensi keamanan. Akibatnya, pengguna dapat saja diarahkan melintasi
gang sepi atau titik rawan kriminalitas tanpa peringatan apa pun. Kesenjangan ini telah
diidentifikasi oleh Hossain et al. (2022), yang mendorong pentingnya pengembangan
algoritma rute alternatif yang turut memasukkan variabel risiko kejahatan sebagai
bobot tambahan dalam proses pencarian jalur, alih-alih hanya mengandalkan efisiensi
geografis semata.
Urgensi permasalahan ini semakin nyata ketika dilihat dari sisi kesiapan
teknologi pendukungnya. Beberapa poin krusial yang menegaskan urgensi
pengembangan sistem Jalan Aman antara lain:
• Kesenjangan fitur keamanan pada aplikasi eksisting. Mayoritas aplikasi
navigasi populer belum memiliki mekanisme peringatan dini terhadap area
rawan kriminalitas, sehingga pengguna kerap tidak menyadari risiko yang
mereka lalui.
• Ketersediaan metode analisis yang sudah teruji. Penelitian di Indonesia
menunjukkan bahwa metode klasterisasi spasial mampu memetakan wilayah
rawan kriminalitas secara akurat berdasarkan data kepolisian (Gustriansyah et
al., 2022), membuktikan bahwa pendekatan berbasis data bukan lagi sekadar
wacana, melainkan solusi yang dapat diimplementasikan.
• Potensi akurasi prediksi yang tinggi. Pendekatan pembelajaran mesin
berbasis fitur lingkungan urban terbukti mampu memprediksi titik rawan
kejahatan dengan akurasi hingga 89,7 persen (Kim et al., 2024), menandakan
bahwa teknologi kecerdasan buatan sudah cukup matang untuk diaplikasikan
dalam konteks keamanan jalanan.
Ketiga temuan tersebut secara kolektif menegaskan bahwa persoalan bukan lagi
terletak pada ketersediaan teknologi, melainkan pada absennya integrasi antara data
kriminalitas, kecerdasan buatan, dan sistem navigasi yang digunakan masyarakat
sehari-hari. Kesenjangan inilah yang menjadi landasan urgensi bagi hadirnya Jalan
Aman sebagai solusi yang menjembatani ketiga elemen tersebut secara terpadu.
2.3 Solusi yang Ditawarkan
Menjawab kesenjangan yang telah diuraikan sebelumnya, Jalan Aman hadir
dengan pendekatan tiga lapis yang saling terintegrasi, mulai dari pengumpulan data
hingga penyajian rute akhir kepada pengguna. Alih-alih hanya menambal kekurangan
aplikasi navigasi konvensional dengan fitur tambahan yang bersifat kosmetik, Jalan
Aman membangun ulang cara kerja sistem pencarian rute dari akarnya, dengan
menempatkan variabel keamanan sejajar dengan variabel jarak dan waktu tempuh.
Berikut adalah pemetaan solusi yang ditawarkan Jalan Aman terhadap setiap
permasalahan yang telah diidentifikasi:
• Menjawab minimnya kewaspadaan terhadap jam rawan kejahatan.
Sistem secara otomatis menyesuaikan bobot risiko rute berdasarkan waktu
perjalanan pengguna, sehingga rekomendasi rute pada dini hari akan berbeda
secara signifikan dengan rekomendasi pada siang hari, mengikuti pola
kerawanan yang berubah sepanjang waktu.
• Menjawab tingginya angka kejahatan jalanan yang tidak terdeteksi sistem
navigasi. Melalui fitur crowdsourcing, setiap pengguna dapat melaporkan
insiden atau kondisi jalan secara real-time, menciptakan basis data kerawanan
yang terus hidup dan diperbarui oleh komunitas, tidak hanya bergantung pada
data kepolisian yang sifatnya periodik.
• Menjawab kebutaan aplikasi navigasi konvensional terhadap dimensi
keamanan. Laporan yang terkumpul diolah menggunakan algoritma DBSCAN
untuk mengidentifikasi klaster titik rawan secara dinamis, sehingga sistem
mampu mengenali pola sebaran kejahatan tanpa perlu penentuan area rawan
secara manual.
• Menjawab kebutuhan prediksi risiko yang akurat, bukan sekadar reaktif.
Tingkat bahaya pada tiap ruas jalan diprediksi menggunakan algoritma Random
Forest yang mempertimbangkan faktor waktu, riwayat insiden, dan kondisi
lingkungan sekitar, sehingga sistem tidak hanya mencatat kejadian yang sudah
terjadi, tetapi juga mengantisipasi potensi risiko di area yang datanya masih
minim.
• Menjawab keterbatasan algoritma pencarian rute konvensional. Hasil
prediksi risiko diintegrasikan langsung ke dalam algoritma A-Star yang bobot
edge-nya telah dimodifikasi, sehingga pencarian rute tidak lagi murni mengejar
jarak terpendek, melainkan secara aktif meminimalkan paparan pengguna
terhadap area berisiko sepanjang perjalanan.
Dengan kombinasi kelima solusi tersebut, Jalan Aman tidak sekadar menjadi
aplikasi penunjuk arah tambahan, melainkan transformasi cara masyarakat memandang
navigasi itu sendiri, dari yang semula hanya soal "rute tercepat" menjadi soal "rute yang
membawa pulang dengan selamat".
2.4 Keunggulan dan Nilai Inovasi
Pemanfaatan teknologi untuk menanggulangi risiko kejahatan jalanan
sebenarnya bukan wacana baru. Baik di tingkat internasional maupun nasional,
sejumlah pendekatan telah dikembangkan dan diimplementasikan dengan caranya
masing-masing. Berikut adalah analisis terhadap solusi-solusi yang pernah ada sebagai
pembanding posisi inovasi Jalan Aman.
1. Publikasi Riset dan Algoritma Internasional (Contoh: SafetiPin dan Crime-
Aware Routing Algorithm)
Di tingkat global, pendekatan crime-aware navigation telah dikembangkan baik
melalui platform crowdsourcing keamanan seperti SafetiPin, yang memungkinkan
pengguna memberi skor keamanan pada suatu area berdasarkan faktor pencahayaan,
keramaian, dan kondisi jalan, maupun melalui riset algoritmik seperti yang diusulkan
Hossain et al. (2022), yang merancang metode pencarian rute dengan bobot risiko
kejahatan sebagai variabel tambahan dalam proses routing. Keunggulan dari
pendekatan-pendekatan ini terletak pada kekayaan data kualitatif yang dihasilkan
komunitas serta validitas akademis dari model algoritmiknya. Namun, kelemahannya
adalah kedua pendekatan ini masih berjalan secara terpisah, di mana platform
crowdsourcing seperti SafetiPin berhenti pada tahap pemetaan dan skoring area tanpa
terhubung langsung ke mesin pencarian rute, sementara riset algoritmik semacam
Hossain et al. (2022) umumnya masih berupa purwarupa akademis yang belum
mengintegrasikan mekanisme prediksi risiko berbasis machine learning yang adaptif
terhadap waktu dan pola kejahatan yang terus berubah.
2. Aplikasi Pelaporan dan Keamanan Nasional (Contoh: JAKI dan Qlue)
Di tingkat nasional, terdapat beberapa platform lokal yang berfokus pada
pelaporan kondisi kota atau insiden kepada otoritas terkait, seperti JAKI (Jakarta Kini)
yang menyediakan fitur pelaporan dan tombol darurat, serta Qlue yang digunakan
sebagai kanal aduan warga terhadap berbagai persoalan perkotaan termasuk gangguan
keamanan. Kekuatan dari sistem lokal ini adalah kemudahan akses pelaporan yang
langsung terhubung dengan instansi pemerintah maupun kepolisian. Namun, celah
yang masih ada adalah sifatnya yang cenderung reaktif dan administratif, artinya,
laporan baru diproses setelah insiden terjadi dan lebih berfungsi sebagai kanal
pengaduan, bukan sebagai sistem navigasi yang secara proaktif mengarahkan
pengguna menjauh dari area berisiko sebelum insiden itu terjadi. Belum ada aplikasi
lokal yang mengintegrasikan data pelaporan warga dengan mesin pencarian rute cerdas
yang mempertimbangkan tingkat kerawanan secara real-time.
Perbandingan Head-to-Head: Jalan Aman vs Solusi Eksisting
Aspek SafetiPin / Riset
Algoritmik JAKI / Qlue Jalan Aman
Sumber data Crowdsourcing
komunitas
Laporan warga
ke instansi
Crowdsourcing real-time +
data historis kepolisian
Sifat sistem Pemetaan &
skoring area
Reaktif, kanal
pengaduan
Proaktif, mencegah sebelum
insiden terjadi
Analisis risiko Manual/statis Tidak ada Dinamis via DBSCAN
clustering
Prediksi
bahaya
prediktif adaptif Belum ada model
Tidak ada Random Forest, faktor
waktu & lingkungan
Output ke
pengguna
rute Skor area, bukan
Notifikasi aduan Rekomendasi rute optimal
via A-Star termodifikasi
Integrasi end-
to-end
Terpisah dari
sistem navigasi
Tidak terhubung
ke navigasi
Terintegrasi penuh dari
laporan hingga rute
Dari perbandingan tersebut, dapat dilihat bahwa Jalan Aman bukan sekadar
menggabungkan fitur yang sudah ada, melainkan menutup celah struktural yang selama
ini memisahkan tiga elemen krusial, yaitu partisipasi komunitas, kecerdasan prediktif,
dan mesin pencarian rute, ke dalam satu alur kerja yang utuh dan saling memperkuat.
Nilai inovasi utama Jalan Aman terletak pada kemampuannya mengubah data
kerawanan yang sebelumnya statis dan terpisah menjadi rekomendasi rute yang hidup,
adaptif terhadap waktu, dan langsung dapat ditindaklanjuti oleh pengguna di lapangan.
BAB III
PERANCANGAN DAN IMPLEMENTASI PROJECT
3.1 Konsep dan Alur Project
Secara konseptual, Jalan Aman dirancang sebagai sebuah pipeline data yang
mengalir dari sumber paling dasar, yaitu laporan masyarakat, hingga keluaran akhir
berupa rekomendasi rute teraman yang siap digunakan pengguna. Alur kerja ini
dibangun dalam empat tahapan utama yang saling terhubung, di mana keluaran dari
satu tahap menjadi masukan bagi tahap berikutnya, sehingga sistem dapat bekerja
secara otomatis dan terus memperbarui pemahamannya terhadap kondisi keamanan
jalanan.
Tahapan pertama dimulai dari pengumpulan data melalui skema crowdsourcing,
di mana pengguna dapat melaporkan insiden kriminal, kondisi jalan yang minim
penerangan, atau situasi mencurigakan secara real-time melalui aplikasi. Data laporan
ini kemudian digabungkan dengan data historis kepolisian untuk memperkaya basis
informasi yang dimiliki sistem. Pada tahap kedua, seluruh data lokasi kejadian tersebut
diproses menggunakan metode klasterisasi spasial DBSCAN (Density-Based Spatial
Clustering of Applications with Noise), sebuah algoritma yang mengelompokkan titik-
titik data berdasarkan kepadatan sebarannya sehingga mampu mengidentifikasi area
rawan kejahatan secara otomatis tanpa perlu menentukan jumlah klaster di awal,
sekaligus dapat membedakan titik kejadian yang benar-benar membentuk pola dari titik
yang bersifat anomali atau noise (Ester et al., 1996).
Tahap ketiga adalah proses prediksi tingkat bahaya pada tiap ruas jalan
menggunakan algoritma Random Forest, dengan mempertimbangkan variabel waktu
kejadian, riwayat insiden pada area tersebut, dan kondisi lingkungan sekitar seperti
tingkat pencahayaan dan keramaian. Hasil prediksi ini kemudian diteruskan ke tahap
terakhir, yaitu proses pencarian rute menggunakan algoritma A-Star yang telah
dimodifikasi. Algoritma A-Star sendiri pada dasarnya merupakan algoritma pencarian
jalur yang bekerja dengan mengombinasikan biaya perjalanan aktual dari titik awal
dengan estimasi heuristik menuju titik tujuan, sehingga mampu menemukan jalur
optimal secara efisien (Hart et al., 1968). Dalam konteks Jalan Aman, bobot edge pada
algoritma ini dimodifikasi dengan menambahkan skor risiko kejahatan dari hasil
prediksi Random Forest, sehingga rute yang dihasilkan tidak lagi murni mengejar jarak
terpendek, melainkan jalur yang menyeimbangkan efisiensi perjalanan dengan tingkat
keamanan yang dapat diberikan kepada pengguna.
3.2 Target Pengguna dan Potensi Pasar
Profil Target Pengguna
Jalan Aman dirancang untuk menjangkau segmen masyarakat urban yang
aktivitasnya paling sering bersinggungan dengan risiko kejahatan jalanan pada malam
hingga dini hari. Berikut adalah profil target pengguna utama sistem ini:
• Pengemudi ojek online dan kurir logistik. Kelompok ini menghabiskan
sebagian besar waktu kerjanya di jalan pada jam-jam rawan, termasuk dini hari,
sehingga sangat membutuhkan rute yang meminimalkan paparan risiko
kejahatan sekaligus tetap efisien dari segi waktu tempuh.
• Mahasiswa dan pekerja shift malam. Kelompok ini kerap pulang larut dari
kampus, tempat kerja, atau kegiatan sosial, dan umumnya bergantung pada
transportasi pribadi atau ojek online tanpa panduan keamanan tambahan.
• Perempuan pekerja dan komuter perkotaan. Kelompok yang secara statistik
lebih rentan menjadi korban kejahatan jalanan dan memiliki kebutuhan tinggi
terhadap rasa aman saat bepergian sendirian.
• Wisatawan dan pendatang baru di kota besar. Kelompok yang belum
familiar dengan area rawan di suatu wilayah dan membutuhkan panduan
navigasi yang lebih dari sekadar arah tercepat.
Estimasi Potensi Pasar (TAM, SAM, SOM)
Untuk mengukur skala peluang pasar Jalan Aman, dilakukan pendekatan estimasi
menggunakan kerangka Total Addressable Market (TAM), Serviceable Available
Market (SAM), dan Serviceable Obtainable Market (SOM), dengan basis data
kependudukan dan digital terkini.
• TAM (Total Addressable Market). Basis pasar total mengacu pada jumlah
pengguna internet aktif di Indonesia yang mencapai 221,5 juta jiwa atau setara
79,5 persen dari total populasi pada 2024 (APJII, 2024). Angka ini
merepresentasikan seluruh potensi pengguna yang secara teknis dapat
mengakses aplikasi berbasis navigasi digital.
• SAM (Serviceable Available Market). Pasar yang secara realistis dapat
dilayani dipersempit pada penduduk perkotaan dengan mobilitas tinggi dan
kepemilikan perangkat pintar, yang direpresentasikan oleh gabungan dua
kelompok utama, yaitu mitra pengemudi ojek online yang tercatat mencapai 3,1
juta orang pada akhir 2023 (Databoks, 2024) dan angkatan kerja aktif di DKI
Jakarta yang berjumlah 5,44 juta orang pada 2024 (BPS DKI Jakarta, 2024),
dengan tingkat kepemilikan telepon pintar di wilayah Jakarta yang mencapai
83,43 persen dari total penduduknya (Databoks, 2025).
• SOM (Serviceable Obtainable Market). Pasar yang secara realistis dapat
diraih pada tahap awal peluncuran difokuskan pada wilayah pilot project di
Jabodetabek, dengan target penetrasi awal sebesar 1 hingga 3 persen dari SAM,
atau setara kurang lebih 85.000 hingga 250.000 pengguna aktif pada tahun
pertama, mencakup komunitas pengemudi ojek online, mahasiswa, dan pekerja
shift malam di area dengan tingkat kerawanan kejahatan tertinggi berdasarkan
data Polda Metro Jaya.
Dengan mempertimbangkan tren peningkatan mobilitas malam hari serta belum
adanya solusi navigasi berbasis keamanan yang terintegrasi penuh di pasar lokal, Jalan
Aman memiliki ruang pertumbuhan yang signifikan, baik dari sisi perluasan wilayah
operasional ke kota-kota besar lain di Indonesia maupun dari sisi pengembangan model
bisnis lanjutan seperti kemitraan dengan platform ojek online dan instansi keamanan.
3.3 Perancangan Project
3.3.1 Arsitektur Sistem
(Narasi pengantar 2-3 kalimat: jelaskan secara umum bahwa arsitektur ini
menggambarkan bagaimana komponen crowdsourcing, DBSCAN, Random Forest,
dan A-Star saling terhubung dari sisi client hingga server)
[LETAKKAN GAMBAR ARSITEKTUR SISTEM DI SINI]
Gambar 3.1 Arsitektur Sistem Jalan Aman
(Narasi penutup setelah gambar, 1 paragraf: jelaskan alur data secara singkat
mengikuti nomor/panah pada diagram, misal: "Seperti terlihat pada Gambar 3.1, data
laporan dari pengguna (1) dikirim ke server melalui API, kemudian diproses oleh
modul clustering (2), diteruskan ke modul prediksi (3), dan akhirnya diintegrasikan ke
mesin pencarian rute (4) sebelum hasilnya ditampilkan kembali ke aplikasi pengguna
(5).")
3.3.2 Use Case Diagram
(Narasi pengantar singkat: jelaskan aktor yang terlibat, misalnya Pengguna,
Admin/Sistem, dan Kepolisian/Pemangku Kebijakan jika relevan)
[LETAKKAN USE CASE DIAGRAM DI SINI]
Gambar 3.2 Use Case Diagram Sistem Jalan Aman
(Narasi penutup: uraikan use case utama dalam bentuk poin singkat, misalnya)
• Melaporkan insiden kriminal/kondisi jalan
• Mencari rute teraman
• Melihat peta area rawan
• Mengelola data laporan (khusus admin)
3.3.3 Entity Relationship Diagram (ERD)
(Narasi pengantar singkat: jelaskan bahwa ERD ini menggambarkan struktur
basis data yang menopang seluruh proses clustering dan prediksi)
[LETAKKAN ERD DI SINI]
Gambar 3.3 Entity Relationship Diagram Sistem Jalan Aman
(Narasi penutup: jelaskan secara singkat entitas utama dan relasinya, misalnya
"Terdapat entitas utama seperti Pengguna, Laporan_Insiden, Klaster_Rawan, dan
Rute, di mana satu Pengguna dapat membuat banyak Laporan_Insiden, dan setiap
Laporan_Insiden akan dikelompokkan ke dalam satu Klaster_Rawan tertentu...")
3.3.4 Alur Logika Sistem (Flowchart/Sequence Diagram)
(Narasi pengantar singkat: jelaskan bahwa bagian ini menggambarkan alur
logis dari input hingga output sistem)
[LETAKKAN FLOWCHART/SEQUENCE DIAGRAM DI SINI]
Gambar 3.4 Alur Logika Sistem Jalan Aman
(Narasi penutup: uraikan tahapan alur secara berurutan dalam bentuk poin atau
paragraf singkat, mengikuti nomor langkah pada diagram)
3.4 Teknologi yang Digunakan
Ekosistem Jalan Aman dibangun dengan mengadopsi arsitektur terpisah
(decoupled architecture) untuk memisahkan beban kerja antarmuka pengguna dengan
komputasi berat pemrosesan data spasial dan machine learning. Platform ini dirancang
ke dalam dua jenis aplikasi client yang memiliki fungsi berbeda, yaitu aplikasi mobile
untuk pengguna umum yang membutuhkan akses cepat terhadap rekomendasi rute
teraman di lapangan, serta aplikasi web dashboard yang digunakan oleh administrator
maupun pemangku kebijakan untuk memantau sebaran klaster rawan dan mengelola
data laporan.
Pada sisi aplikasi mobile, sistem dikembangkan menggunakan React Native,
sebuah framework berbasis JavaScript yang memungkinkan aplikasi berjalan secara
native di platform iOS maupun Android dari satu basis kode yang sama, sehingga
pengembangan fitur seperti pelaporan real-time dan tampilan peta rute dapat dilakukan
lebih efisien tanpa mengorbankan performa. Untuk aplikasi web dashboard, digunakan
Next.js sebagai framework berbasis React yang mendukung server-side rendering,
sehingga visualisasi data klaster kejahatan dan statistik keamanan dapat dimuat dengan
cepat sekaligus tetap optimal dari sisi SEO dan performa halaman.
Pada sisi backend, sistem utama dikembangkan menggunakan bahasa
pemrograman Go (Golang), yang dipilih karena karakteristiknya yang ringan,
mendukung concurrency secara native, dan mampu menangani volume permintaan
API dalam jumlah besar secara bersamaan, sebuah kebutuhan krusial mengingat sistem
harus memproses laporan crowdsourcing dan permintaan pencarian rute secara real-
time dari banyak pengguna sekaligus. Golang bertindak sebagai API Gateway utama
yang menjembatani aplikasi client dengan seluruh layanan di baliknya, termasuk
autentikasi, manajemen data laporan, dan orkestrasi pemanggilan modul kecerdasan
buatan.
Sementara itu, seluruh komputasi kecerdasan buatan, mulai dari klasterisasi
DBSCAN, prediksi tingkat bahaya menggunakan Random Forest, hingga modifikasi
algoritma A-Star, dipisahkan secara khusus dan dikembangkan menggunakan Python.
Pemilihan Python di lapisan ini didasarkan pada kematangan ekosistemnya untuk
pengembangan model machine learning maupun algoritma pencarian jalur berbasis
graf, sehingga proses eksperimentasi dan penyesuaian model dapat dilakukan secara
lebih fleksibel.
Terkait pemilihan algoritma prediksi tingkat bahaya, Random Forest dipilih
dibandingkan algoritma klasifikasi lain seperti Support Vector Machine (SVM) atau
Neural Network karena karakteristiknya yang lebih sesuai dengan struktur data
kriminalitas yang bersifat tabular dan rentan terhadap ketidakseimbangan kelas. Kajian
survei terhadap berbagai metode prediksi kejahatan berbasis machine learning
menunjukkan bahwa Random Forest secara konsisten memberikan akurasi yang
kompetitif dibandingkan algoritma pembanding lain pada berbagai studi kasus,
sekaligus lebih tahan terhadap overfitting dibandingkan model pohon keputusan
tunggal (Yin, 2023). Karakteristik ini menjadikan Random Forest lebih cocok untuk
diterapkan pada konteks data insiden kriminal yang jumlahnya terbatas dan tersebar
tidak merata antarwilayah, dibandingkan model Neural Network yang umumnya
membutuhkan volume data jauh lebih besar untuk mencapai performa optimal.
3.5 Prototype dan Implementasi
Deskripsi visualisasi hasil coding dan tampilan dasbor/aplikasi yang sudah setengah jadi
(MVP).
BAB IV
HASIL DAN PEMBAHASAN
4.1 Hasil Project
Pada tahap ini, pengembangan Jalan Aman telah menghasilkan sebuah
purwarupa (prototype) aplikasi yang berfungsi dan dapat diuji secara langsung,
mencakup sisi aplikasi mobile untuk pengguna umum serta dashboard web untuk
pemantauan data. Prototipe ini telah berhasil mengintegrasikan alur kerja utama sistem,
mulai dari pelaporan insiden oleh pengguna, proses klasterisasi titik rawan
menggunakan DBSCAN, prediksi tingkat bahaya menggunakan Random Forest,
hingga penyajian rekomendasi rute teraman melalui algoritma A-Star yang telah
dimodifikasi.
Secara garis besar, prototipe yang dihasilkan telah mampu menunjukkan alur
kerja end-to-end dari sistem, yaitu pengguna dapat membuka aplikasi, memasukkan
titik asal dan tujuan, menerima rekomendasi rute yang mempertimbangkan skor
keamanan, serta melaporkan insiden atau kondisi jalan langsung dari peta interaktif.
Hasil pengujian awal pada fungsionalitas ini menunjukkan bahwa seluruh komponen
dapat berjalan sebagaimana mestinya dan siap untuk dikembangkan lebih lanjut ke
tahap pengujian pengguna yang lebih luas.
4.2 Fitur dan Fungsionalitas
Berikut adalah rincian fitur dan fungsionalitas yang telah berjalan pada prototipe
Jalan Aman saat ini:
• Peta Interaktif Rute Aman. Menampilkan peta yang dapat digeser dan
diperbesar, dengan visualisasi rute yang direkomendasikan sistem berupa garis
jalur berwarna, serta penanda (pin) pada titik-titik yang teridentifikasi sebagai
klaster rawan kejahatan di sepanjang rute.
• Tombol "Cari Rute Aman". Tombol utama yang memicu proses pencarian
rute setelah pengguna memasukkan titik asal dan tujuan, menjalankan
algoritma A-Star termodifikasi di backend dan menampilkan hasil rute dalam
hitungan detik.
• Indikator Skor Keamanan Rute. Menampilkan tingkat keamanan rute yang
direkomendasikan dalam bentuk skor atau label (misalnya "Aman",
"Waspada", "Berisiko"), sehingga pengguna dapat langsung memahami tingkat
risiko tanpa perlu membaca data mentah.
• Perbandingan Rute Tercepat vs Rute Teraman. Menampilkan dua opsi rute
secara berdampingan, yaitu rute dengan jarak/waktu tempuh tersingkat dan rute
dengan skor keamanan tertinggi, sehingga pengguna dapat membandingkan
trade-off sebelum memilih.
• Tombol Lapor Insiden. Tombol mengambang (floating button) pada tampilan
peta yang memungkinkan pengguna melaporkan insiden kriminal atau kondisi
jalan (misalnya minim penerangan atau area sepi) secara langsung dari lokasi
mereka berada, lengkap dengan pilihan kategori laporan.
• Formulir Laporan Cepat. Formulir ringkas yang muncul setelah tombol lapor
ditekan, berisi kategori insiden, waktu kejadian, dan kolom catatan opsional,
dirancang agar proses pelaporan dapat diselesaikan dalam waktu singkat.
• Notifikasi Area Rawan Real-Time. Sistem memberikan peringatan otomatis
kepada pengguna apabila rute yang sedang dilalui mendekati atau melintasi
klaster area rawan, terutama pada rentang waktu malam hingga dini hari.
• Riwayat Perjalanan dan Laporan. Halaman yang mencatat riwayat pencarian
rute serta laporan insiden yang pernah dibuat oleh pengguna, memudahkan
mereka untuk melacak kontribusi yang telah diberikan ke sistem.
• Dashboard Peta Klaster (Web Admin). Tampilan khusus untuk administrator
yang memvisualisasikan seluruh klaster titik rawan hasil pengolahan DBSCAN
dalam bentuk heatmap, dilengkapi filter berdasarkan rentang waktu dan
wilayah.
• Panel Statistik Laporan (Web Admin). Menampilkan ringkasan jumlah
laporan masuk, kategori insiden terbanyak, dan tren kerawanan per wilayah
dalam bentuk grafik, sebagai alat bantu pengambilan keputusan bagi pemangku
kebijakan.
4.3 Pengujian
BAB V
PENUTUP
5.1 Kesimpulan
Jalan Aman merupakan jawaban atas kesenjangan mendasar yang selama ini
luput dari perhatian industri teknologi navigasi, yaitu ketiadaan pertimbangan aspek
keamanan personal dalam sistem rekomendasi rute yang digunakan masyarakat sehari-
hari. Melalui pengembangan yang telah dilakukan, proyek ini berhasil membuktikan
bahwa penggabungan tiga lapisan teknologi, yaitu skema crowdsourcing untuk
pengumpulan data insiden secara real-time, algoritma DBSCAN untuk pemetaan
klaster kawasan rawan secara dinamis, serta model Random Forest untuk prediksi
tingkat bahaya pada setiap ruas jalan, dapat diintegrasikan secara mulus ke dalam
algoritma A-Star yang bobot edge-nya telah dimodifikasi untuk menghasilkan
rekomendasi rute yang tidak lagi hanya mengejar efisiensi jarak, melainkan juga secara
aktif meminimalkan paparan pengguna terhadap risiko kejahatan sepanjang perjalanan.
Purwarupa yang telah dibangun menunjukkan bahwa keseluruhan alur sistem,
mulai dari pengguna melaporkan insiden hingga rekomendasi rute yang lebih aman
kembali disajikan kepada komunitas, dapat berjalan sebagai satu siklus yang
berkesinambungan dan terus menyempurnakan dirinya sendiri seiring bertambahnya
partisipasi pengguna. Fitur-fitur utama seperti Heatmap Kerawanan, Safe Routing, dan
Real-time Alerts telah berhasil diimplementasikan dan diuji baik dari sisi kualitas
rekayasa perangkat lunak melalui pendekatan Test-Driven Development, maupun dari
sisi akurasi model kecerdasan buatan melalui evaluasi berbasis confusion matrix.
Dengan mempertimbangkan besarnya potensi pasar dari segmen mahasiswa,
pengemudi transportasi daring, dan pekerja shift yang jumlahnya terus bertumbuh di
kota-kota besar Indonesia, Jalan Aman diyakini memiliki fondasi yang kuat untuk
berkembang dari sekadar purwarupa penelitian menjadi solusi navigasi yang benar-
benar dapat diandalkan masyarakat dalam menjalani mobilitas malam hari dengan
lebih tenang dan terlindungi.
5.2 Saran
Mengacu pada hasil pengembangan dan keterbatasan yang masih ditemukan
selama proses pengujian, berikut beberapa saran yang dapat menjadi bahan
pertimbangan untuk pengembangan sistem Jalan Aman selanjutnya:
1. Perluasan cakupan data laporan. Diperlukan strategi untuk memperbanyak
volume laporan crowdsourcing dari pengguna, mengingat akurasi klasterisasi
dan prediksi risiko sangat bergantung pada kualitas dan kuantitas data yang
terkumpul, terutama pada tahap awal peluncuran ketika jumlah pengguna masih
terbatas.
2. Verifikasi dan validasi laporan. Sistem perlu dilengkapi dengan mekanisme
verifikasi tambahan untuk menyaring laporan yang tidak akurat atau
disalahgunakan, agar tingkat kepercayaan pengguna terhadap data yang
ditampilkan tetap terjaga.
3. Pengujian pada skala pengguna yang lebih luas. Pengujian User Acceptance
Test yang telah dilakukan masih terbatas pada jumlah responden yang kecil,
sehingga pengujian lanjutan dengan jumlah dan variasi responden yang lebih
besar perlu dilakukan untuk memvalidasi hasil secara lebih representatif.
4. Peningkatan performa model prediksi. Model Random Forest yang
digunakan saat ini masih dapat dikembangkan lebih lanjut, misalnya dengan
menambahkan variabel fitur baru atau membandingkan performanya dengan
algoritma ensemble lain, guna meningkatkan akurasi prediksi tingkat bahaya di
area dengan data historis yang masih minim.
5. Integrasi dengan pihak eksternal. Pengembangan selanjutnya dapat
mempertimbangkan kerja sama dengan platform transportasi online maupun
instansi kepolisian, agar data yang digunakan sistem semakin kaya dan hasil
rekomendasi rute dapat lebih tervalidasi secara resmi.
6. Optimasi performa aplikasi. Mengingat sistem membutuhkan pemrosesan
data spasial dan machine learning secara real-time, optimasi lebih lanjut pada
sisi backend perlu dilakukan agar waktu respons pencarian rute tetap cepat
meskipun jumlah pengguna dan volume data terus bertambah.
Daftar Pustaka
Gustriansyah, R., Alie, J., & Suhandi, N. (2022). Hierarchical clustering for crime
rate mapping in Indonesia. ILKOM Jurnal Ilmiah, 14(3), 275–283.
https://doi.org/10.33096/ilkom.v14i3.1135.275-283
Hossain, E., Karim, M. R., Hasan, M., Zaoad, S. A., Tanjim, T., & Khan, M. M.
(2022). SPaFE: A crowdsourcing and multimodal recommender system to ensure
travel safety in a city. IEEE Access, 10, 71221–71232.
https://doi.org/10.1109/ACCESS.2022.3187964
Kim, G., Cho, Y., Lee, J.-H., & Lee, G. (2024). Correlation analysis between urban
environment features and crime occurrence based on explainable artificial
intelligence techniques. Journal of Asian Architecture and Building Engineering.
https://doi.org/10.1080/13467581.2024.2421260
Pusiknas Bareskrim Polri. (2024, 5 Juni). Rata-rata, hampir tiap hari pelaku begal
beraksi di Jakarta dan sekitarnya. https://pusiknas.polri.go.id/detail_artikel/rata-
rata,_hampir_tiap_hari_pelaku_begal_beraksi_di_jakarta_dan_sekitarnya