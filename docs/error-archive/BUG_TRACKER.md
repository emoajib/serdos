# BUG TRACKER - SERDOS Digital Nusantara

## Format

```
## [Status] Issue #XX - Description
- **Date Reported**: YYYY-MM-DD
- **Severity**: Critical | High | Medium | Low
- **Component**: Backend | Frontend | AI | Infra
- **Assigned to**: @username
- **Steps to Reproduce**:
- **Expected Result**:
- **Actual Result**:
- **Root Cause**:
- **Solution**:
- **Status**: Open | In Progress | Resolved | Closed
```

---

## Current Issues

### None at launch

## Closed Issues

### [CLOSED] Issue #001 - NAP Calculation Precision
- **Date**: 2026-04-10
- **Severity**: High
- **Component**: Backend
- **Root Cause**: Floating point arithmetic error
- **Solution**: Implemented Value Object with proper rounding
- **Commit**: abc123def456

### [CLOSED] Issue #002 - WebSocket Reconnection
- **Date**: 2026-04-09
- **Severity**: Medium
- **Component**: Frontend
- **Root Cause**: Missing reconnection logic
- **Solution**: Added echo listener with retry mechanism
- **Commit**: abc123def457

## Known Limitations

1. AI Similarity Engine - Currently returns dummy data (placeholder implementation)
2. Payment System - Requires Midtrans API keys configuration
3. Email Service - Requires SMTP configuration

## Performance Notes

- Initial API response: ~200ms
- WebSocket latency: ~50ms
- Database queries: Optimized with eager loading
- Frontend bundle: ~250KB (gzipped)

## Monitoring Alerts

Configure these thresholds:

- API response time > 500ms
- Error rate > 1%
- WebSocket disconnections > 10/hour
- Database CPU > 80%
- Memory usage > 85%

## Escalation Path

1. Team Lead
2. Backend Lead
3. Ops Team
4. Product Manager

---

**Last Updated**: 2026-04-10
