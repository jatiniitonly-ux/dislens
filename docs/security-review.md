# Security review

## Controls

- Validate extension, MIME, magic bytes, size, raster dimensions, CRS, band count and cloud metadata server-side; the client check is only a usability aid.
- Generate safe random object keys; never use user filenames as paths. Reject traversal, symlinks, nested archives, zip bombs and unsupported formats. Scan uploads before worker access.
- Keep object storage private and return short-lived signed URLs. Never expose storage credentials, database credentials or provider keys in browser bundles.
- Enforce authentication and role-based authorization for events, layers, reports, admin weights and review actions. Record audit logs for uploads, analyses, exports and human review.
- Use parameterized SQL/SQLAlchemy, Pydantic validation, output encoding, restrictive CORS, CSP, secure headers, rate limits and request-size limits. Add CSRF protection if cookie-authenticated write routes are enabled.
- Separate synthetic demo records from operational data. Apply retention, deletion and privacy policy to imagery and population layers.
- Report processing errors with a fix path but do not leak stack traces, object keys or credentials.

The MVP contains no private credentials, uses no live provider, and keeps synthetic demo values clearly labeled.
