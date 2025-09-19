import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock data based on the booking code
  const mockGames = [
    {
      team1: "Bodoe/Glimt",
      team2: "Kristiansund BK",
      prediction: "1X2",
      odds: "1.11",
      category: "Home"
    },
    {
      team1: "Paderborn",
      team2: "Bochum",
      prediction: "1X2",
      odds: "1.97",
      category: "Home"
    },
    {
      team1: "Arminia Bielefeld",
      team2: "1. FC Magdeburg",
      prediction: "1X2",
      odds: "2.15",
      category: "Home"
    },
    {
      team1: "Bayer Leverkusen",
      team2: "Eintracht Frankfurt",
      prediction: "1X2",
      odds: "2.36",
      category: "Home"
    }
  ];

  // Calculate total odds
  const totalOdds = mockGames.reduce((total, game) => total * parseFloat(game.odds), 1).toFixed(2);

  // Simulate different responses based on code
  if (code === 'INVALID' || code === 'ERROR') {
    return NextResponse.json({
      success: false,
      message: 'Invalid booking code. Please check and try again.'
    }, { status: 400 });
  }

  if (code === 'EMPTY') {
    return NextResponse.json({
      success: true,
      games: [],
      totalOdds: 0,
      message: 'No games found for this booking code.'
    });
  }

  // Return mock data for any other code
  return NextResponse.json({
    success: true,
    games: mockGames,
    totalOdds: totalOdds,
    message: `Successfully loaded ${mockGames.length} games from booking code: ${code}`
  });
}
