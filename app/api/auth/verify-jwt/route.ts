import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, secret = SECRET_KEY } = body;

    if (!token || typeof token !== 'string') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Token is required and must be a string',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, secret);

    return new Response(
      JSON.stringify({
        success: true,
        valid: true,
        decoded,
        message: 'Token is valid and has not expired',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const message = error instanceof jwt.JsonWebTokenError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Unknown error';

    const status =
      error instanceof jwt.TokenExpiredError ? 401 : error instanceof jwt.JsonWebTokenError ? 400 : 500;

    return new Response(
      JSON.stringify({
        success: false,
        valid: false,
        error: message,
      }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({
      success: true,
      method: 'POST',
      endpoint: '/api/auth/verify-jwt',
      description: 'Verify and decode a JWT token',
      usage: {
        url: 'POST /api/auth/verify-jwt',
        body: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          secret: 'optional-custom-secret-if-different',
        },
      },
      responses: {
        valid: {
          status: 200,
          example: {
            success: true,
            valid: true,
            decoded: {
              userId: 'user123',
              email: 'test@example.com',
              iat: 1650000000,
              exp: 9999999999,
            },
          },
        },
        expired: {
          status: 401,
          example: {
            success: false,
            valid: false,
            error: 'jwt expired',
          },
        },
        invalid: {
          status: 400,
          example: {
            success: false,
            valid: false,
            error: 'invalid token',
          },
        },
      },
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
