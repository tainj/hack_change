package service

import (
	"context"
	"errors"
	"testing"

	"hack_change/internal/auth"
	"hack_change/internal/dto"
	"hack_change/internal/models"

	"github.com/google/uuid"
)

// mockUserRepo implements the minimal methods we need for tests
type mockUserRepo struct {
	users map[string]*models.User
}

func newMockUserRepo() *mockUserRepo {
	return &mockUserRepo{users: make(map[string]*models.User)}
}

func (m *mockUserRepo) Register(ctx context.Context, user *models.User) error {
	if user == nil {
		return errors.New("nil user")
	}
	m.users[user.Email] = user
	return nil
}

func (m *mockUserRepo) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	if u, ok := m.users[email]; ok {
		return u, nil
	}
	return nil, errors.New("not found")
}

func (m *mockUserRepo) GetByID(ctx context.Context, id string) (*models.User, error) {
	for _, u := range m.users {
		if u.ID.String() == id {
			return u, nil
		}
	}
	return nil, errors.New("not found")
}

// mockJWTService returns a deterministic token
type mockJWTService struct{}

func (m *mockJWTService) GenerateToken(userID string) (string, error) {
	if _, err := uuid.Parse(userID); err != nil {
		return "", errors.New("invalid id")
	}
	return "tok-" + userID, nil
}

func (m *mockJWTService) ParseToken(tokenStr string) (*auth.Claims, error) {
	return nil, nil
}

func TestAuthService_Register_Login(t *testing.T) {
	ctx := context.Background()
	repo := newMockUserRepo()
	jwt := &mockJWTService{}
	svc := NewService(repo, jwt)

	t.Run("register success", func(t *testing.T) {
		req := &dto.RegisterRequest{
			Email:     "alice@example.com",
			Password:  "s3cretpass",
			FirstName: "Alice",
			LastName:  "Wonder",
			Role:      string(models.RoleStudent),
		}

		userResp, err := svc.Register(ctx, req)
		if err != nil {
			t.Fatalf("expected no error, got %v", err)
		}
		if userResp.Email != req.Email {
			t.Fatalf("expected email %s, got %s", req.Email, userResp.Email)
		}
	})

	t.Run("register duplicate email", func(t *testing.T) {
		req := &dto.RegisterRequest{
			Email:     "alice@example.com",
			Password:  "s3cretpass",
			FirstName: "Alice",
			LastName:  "Wonder",
			Role:      string(models.RoleStudent),
		}
		_, err := svc.Register(ctx, req)
		if err == nil {
			t.Fatalf("expected error for duplicate email")
		}
	})

	t.Run("login success", func(t *testing.T) {
		// ensure user exists in repo with hashed password
		plain := "login-pass"
		hashed, _ := auth.HashPassword(plain)
		id := uuid.New()
		user := &models.User{
			ID:           id,
			Email:        "bob@example.com",
			PasswordHash: hashed,
			FirstName:    "Bob",
			LastName:     "Builder",
			Role:         models.RoleStudent,
		}
		_ = repo.Register(ctx, user)

		lr := &dto.LoginRequest{Email: user.Email, Password: plain}
		resp, err := svc.Login(ctx, lr)
		if err != nil {
			t.Fatalf("expected login success, got error: %v", err)
		}
		if resp.Token == "" {
			t.Fatalf("expected token, got empty")
		}
		if resp.User.Email != user.Email {
			t.Fatalf("expected user email %s, got %s", user.Email, resp.User.Email)
		}
	})

	t.Run("login invalid password", func(t *testing.T) {
		lr := &dto.LoginRequest{Email: "bob@example.com", Password: "wrong"}
		_, err := svc.Login(ctx, lr)
		if err == nil {
			t.Fatalf("expected error for invalid password")
		}
	})
}
