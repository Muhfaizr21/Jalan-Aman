package model

// DashboardStats merepresentasikan agregasi metrik platform untuk Command Center Superadmin
type DashboardStats struct {
	TotalUsers        int `json:"total_users"`
	TotalIncidents    int `json:"total_incidents"`
	VerifiedIncidents int `json:"verified_incidents"`
	PendingIncidents  int `json:"pending_incidents"`
	TotalShelters     int `json:"total_shelters"`
}
