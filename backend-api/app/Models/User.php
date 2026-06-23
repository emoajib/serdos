<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * Vetted by AI - Manual Review Required by Senior Engineer/Manager
 */
class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'user_type',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the role attribute (maps to user_type column)
     */
    public function getRoleAttribute(): string
    {
        return $this->user_type ?? 'dosen';
    }

    /**
     * Set the role attribute (maps to user_type column)
     */
    public function setRoleAttribute(string $value): void
    {
        $this->attributes['user_type'] = $value;
    }

    // ─── Relationships ───────────────────────────────────────────────────────

    public function simulations()
    {
        return $this->hasMany(Simulation::class);
    }

    public function portfolios()
    {
        return $this->hasMany(Portfolio::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    // ─── Business Logic ──────────────────────────────────────────────────────

    /**
     * Check if user has at least one settled payment (Premium Package)
     */
    public function hasActiveSubscription(): bool
    {
        // For admin, always return true
        if ($this->role === 'admin') return true;

        return $this->payments()->where('status', 'settled')->exists();
    }
}
