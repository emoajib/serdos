<?php

namespace Tests\Unit\Domain\Serdos;

use App\Domain\Serdos\Actions\CalculateNAPAction;
use Tests\TestCase;

/**
 * Vetted by AI - Manual Review Required by Senior Engineer/Manager
 */
class CalculateNAPActionTest extends TestCase
{
    private CalculateNAPAction $action;

    protected function setUp(): void
    {
        parent::setUp();
        $this->action = new CalculateNAPAction();
    }

    /**
     * Test high scores (Success case)
     */
    public function test_calculate_nap_with_high_scores()
    {
        $result = $this->action->execute(100, 100, 100);

        $this->assertEquals(100.0, $result->nap);
        $this->assertEquals('diterima', $result->status);
        $this->assertEquals('valid', $result->statusCode);
    }

    /**
     * Test low scores (Anti-Fail case)
     */
    public function test_calculate_nap_with_low_scores_fails()
    {
        // Formula: (0.35 * 2) + (0.10 * 2) + (0.55 * 4) = 0.7 + 0.2 + 2.2 = 3.1
        $result = $this->action->execute(2.0, 2.0, 4.0);

        $this->assertEquals(3.1, $result->nap);
        $this->assertEquals('ditolak', $result->status);
        $this->assertEquals('anti_fail', $result->statusCode);
    }

    /**
     * Test boundary score (NAP = 4.2 should be ditolak)
     */
    public function test_calculate_nap_boundary_at_4_2_fails()
    {
        // Formula: (0.35 * 4.2) + (0.10 * 4.2) + (0.55 * 4.2) = 1.0 * 4.2 = 4.2
        $result = $this->action->execute(4.2, 4.2, 4.2);

        $this->assertEquals(4.2, $result->nap);
        $this->assertEquals('ditolak', $result->status);
        $this->assertEquals('anti_fail', $result->statusCode);
    }

    /**
     * Test small pass (NAP slightly above 4.2)
     */
    public function test_calculate_nap_slightly_above_4_2_passes()
    {
        // Formula: (0.35 * 4.3) + (0.10 * 4.3) + (0.55 * 4.3) = 4.3
        $result = $this->action->execute(4.3, 4.3, 4.3);

        $this->assertEquals(4.3, $result->nap);
        $this->assertEquals('diterima', $result->status);
        $this->assertEquals('valid', $result->statusCode);
    }
}
