import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  // Fetch booking data from backend and transform to expected shape
  try {
    const backendUrl = `http://127.0.0.1:8000/load-booking/${encodeURIComponent(code)}/`;
    const res = await fetch(backendUrl);

    if (!res.ok) {
      // Propagate backend error status
      const text = await res.text().catch(() => '');
      return NextResponse.json({ success: false, message: `Backend returned ${res.status}: ${text}` }, { status: res.status });
    }

    const data = await res.json();

    // Expect data.games to be an array
    const rawGames = Array.isArray(data.games) ? data.games : [];

    // Transform each game to the expected shape
    const games = rawGames.map((g: any) => {
      const team1 = g.home ?? g.team1 ?? '';
      const team2 = g.away ?? g.team2 ?? '';
      const prediction = g.prediction ?? '';
      // Ensure odds is a string
      const oddsValue = g.odd ?? g.odds ?? 0;
      const odds = typeof oddsValue === 'number' ? oddsValue.toFixed(2) : String(oddsValue);
      // Prefer tournament, fall back to sport
      const category = g.tournament ?? g.sport ?? g.category ?? '';

      return {
        team1,
        team2,
        prediction,
        odds,
        category
      };
    });

    // Calculate aggregated total odds (product of numeric odds)
    const numericOdds = games.map(g => parseFloat(String(g.odds)) || 1);
    const totalOdds = numericOdds.reduce((acc, v) => acc * v, 1);

    return NextResponse.json({
      success: true,
      games,
      totalOdds: totalOdds.toFixed(2),
      message: `Successfully loaded ${games.length} games from booking code: ${code}`
    });
  } catch (err: any) {
    console.error('Error fetching booking from backend:', err);
    return NextResponse.json({ success: false, message: 'Error fetching booking data' }, { status: 502 });
  }
}
