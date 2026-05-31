import jwt from 'jsonwebtoken';

interface JWTPayload {
  userId?: string;
  email?: string;
  name?: string;
  role?: string;
  [key: string]: any;
}

const SECRET_KEY = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';
const EXPIRATION = '24h';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { payload = {}, secret = SECRET_KEY, expiresIn = EXPIRATION } = body;

    // Validate payload
    if (typeof payload !== 'object' || payload === null) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Payload must be a valid object',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Add issued-at timestamp if not present
    const jwtPayload: JWTPayload = {
      iat: Math.floor(Date.now() / 1000),
      ...payload,
    };

    // Generate token
    const token = jwt.sign(jwtPayload, secret, { expiresIn });

    // Decode to show user what's in the token
    const decoded = jwt.decode(token) as any;

    return new Response(
      JSON.stringify({
        success: true,
        token,
        decoded,
        expiresIn,
        type: 'Bearer',
        usage: `Authorization: Bearer ${token}`,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({
        success: false,
        error: message,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({
      success: true,
      method: 'POST',
      endpoint: '/api/auth/generate-jwt',
      description: 'Generate a JWT token with custom payload',
      usage: {
        url: 'POST /api/auth/generate-jwt',
        body: {
          payload: {
            userId: 'user123',
            email: 'test@example.com',
            name: 'John Doe',
            role: 'admin',
          },
          secret: 'optional-custom-secret',
          expiresIn: '24h',
        },
      },
      example: {
        userId: 'Generate a test token with user ID',
        email: 'User email address',
        name: 'User full name',
        role: 'User role (admin, user, moderator, etc.)',
        customField: 'Add any custom fields to payload',
      },
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
