package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"

	"vibetour/internal/core/domains"
)

type AuthRepository interface {
	CreateUser(ctx context.Context, email, passwordHash string) (*domains.User, error)
	GetUserByEmail(ctx context.Context, email string) (*domains.User, error)
}

type authPostgresRepository struct {
	db  *pgxpool.Pool
	log *zap.Logger
}

func NewAuthRepository(db *pgxpool.Pool, log *zap.Logger) AuthRepository {
	return &authPostgresRepository{
		db:  db,
		log: log,
	}
}

func (r *authPostgresRepository) CreateUser(ctx context.Context, email, passwordHash string) (*domains.User, error) {
	query := `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, password, created_at`
	var user domains.User
	err := r.db.QueryRow(ctx, query, email, passwordHash).Scan(&user.ID, &user.Email, &user.Password, &user.CreatedAt)
	if err != nil {
		r.log.Error("failed to create user", zap.Error(err), zap.String("email", email))
		return nil, err
	}
	return &user, nil
}

func (r *authPostgresRepository) GetUserByEmail(ctx context.Context, email string) (*domains.User, error) {
	query := `SELECT id, email, password, created_at FROM users WHERE email = $1`
	var user domains.User
	err := r.db.QueryRow(ctx, query, email).Scan(&user.ID, &user.Email, &user.Password, &user.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &user, nil
}
