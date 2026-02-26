import { NextRequest, NextResponse } from 'next/server';

// Mock location data - in production this would use the database service
const mockLocations = [
  {
    id: '1',
    personId: '1',
    personName: 'Juan García',
    latitude: 19.4326,
    longitude: -99.1332,
    accuracy: 10,
    timestamp: new Date().toISOString(),
    batteryLevel: 85,
  },
  {
    id: '2',
    personId: '2',
    personName: 'Ana García',
    latitude: 19.4284,
    longitude: -99.1276,
    accuracy: 15,
    timestamp: new Date().toISOString(),
    batteryLevel: 62,
  },
  {
    id: '3',
    personId: '3',
    personName: 'Sofia García',
    latitude: 19.4350,
    longitude: -99.1400,
    accuracy: 8,
    timestamp: new Date().toISOString(),
    batteryLevel: 91,
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const familyId = searchParams.get('familyId');
  const personId = searchParams.get('personId');

  // In production, validate auth and fetch from database
  let locations = mockLocations;

  if (personId) {
    locations = locations.filter((l) => l.personId === personId);
  }

  return NextResponse.json({
    success: true,
    data: locations,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { personId, latitude, longitude, accuracy, batteryLevel } = body;

    // Validate required fields
    if (!personId || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In production, save to database and check geofences
    const location = {
      id: Date.now().toString(),
      personId,
      latitude,
      longitude,
      accuracy: accuracy || 0,
      batteryLevel: batteryLevel || null,
      timestamp: new Date().toISOString(),
    };

    // Mock geofence check
    const geofenceEvents: { type: string; geofenceId: string; timestamp: string }[] = [];
    // In production, check against actual geofences

    return NextResponse.json({
      success: true,
      data: location,
      geofenceEvents,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
