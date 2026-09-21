package crypto

import (
	"testing"
)

func TestAES256GCM_EncryptDecrypt(t *testing.T) {
	secret := "jalanaman-military-secret-key-32b"
	plain := `{"lat":-6.4012,"lng":108.3188,"speed":45.2}`

	encrypted, err := EncryptAES256GCM(plain, secret)
	if err != nil {
		t.Fatalf("Encrypt error: %v", err)
	}
	if encrypted == plain {
		t.Fatal("Encrypted string should differ from plain text")
	}

	decrypted, err := DecryptAES256GCM(encrypted, secret)
	if err != nil {
		t.Fatalf("Decrypt error: %v", err)
	}
	if decrypted != plain {
		t.Fatalf("Decrypted mismatch: got %s, want %s", decrypted, plain)
	}
}
