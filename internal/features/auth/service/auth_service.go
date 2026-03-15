package service

import (
	"context"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"

	"vibetour/internal/core/config"
	"vibetour/internal/core/domains"
	"vibetour/internal/features/auth/repository"
)

type AuthService interface {
	Register(ctx context.Context, req domains.RegisterRequest) (*domains.AuthResponse, error)
	Login(ctx context.Context, req domains.LoginRequest) (*domains.AuthResponse, error)
}

type authService struct {
	repo repository.AuthRepository
	cfg  *config.Config
	log  *zap.Logger
}

func NewAuthService(repo repository.AuthRepository, cfg *config.Config, log *zap.Logger) AuthService {
	return &authService{
		repo: repo,
		cfg:  cfg,
		log:  log,
	}
}

func (s *authService) Register(ctx context.Context, req domains.RegisterRequest) (*domains.AuthResponse, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		s.log.Error("failed to hash password", zap.Error(err))
		return nil, err
	}

	user, err := s.repo.CreateUser(ctx, req.Email, string(hashedPassword))
	if err != nil {
		return nil, err
	}

	token, err := s.generateToken(user.ID, user.Email)
	if err != nil {
		return nil, err
	}

	return &domains.AuthResponse{Token: token}, nil
}

func (s *authService) Login(ctx context.Context, req domains.LoginRequest) (*domains.AuthResponse, error) {
	user, err := s.repo.GetUserByEmail(ctx, req.Email)
	if err != nil {
		s.log.Warn("login failed, user not found", zap.String("email", req.Email))
		return nil, errors.New("invalid credentials")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		s.log.Warn("login failed, wrong password", zap.String("email", req.Email))
		return nil, errors.New("invalid credentials")
	}

	token, err := s.generateToken(user.ID, user.Email)
	if err != nil {
		return nil, err
	}

	return &domains.AuthResponse{Token: token}, nil
}

func (s *authService) generateToken(userID int, email string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userID,
		"email":   email,
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
	})
	return token.SignedString([]byte(s.cfg.JWTSecret))
}
