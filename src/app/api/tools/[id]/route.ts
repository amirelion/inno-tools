import { NextRequest, NextResponse } from 'next/server';
import { InnovationTool } from '../../../../types';
import toolsData from '../../../../data/tools.json';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const tools = toolsData as InnovationTool[];
    const tool = tools.find(t => t.id === id);
    
    if (!tool) {
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(tool);
  } catch (error) {
    console.error(`Error fetching tool ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch tool' },
      { status: 500 }
    );
  }
} 