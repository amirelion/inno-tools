import { NextResponse } from 'next/server';
import toolsData from '../../../data/tools.json';
import { InnovationTool } from '../../../types';

export async function GET() {
  try {
    // Optional filtering could be added here based on searchParams
    const tools = toolsData as InnovationTool[];
    
    return NextResponse.json(tools);
  } catch (error) {
    console.error('Error fetching tools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tools' },
      { status: 500 }
    );
  }
} 