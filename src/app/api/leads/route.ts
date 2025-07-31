import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Aqui você salvaria os dados no banco de dados
    console.log('Novo lead capturado:', body)
    
    // Simular salvamento no banco
    // await prisma.lead.create({ data: body })
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Lead capturado com sucesso!' 
      }, 
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao capturar lead:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erro interno do servidor' 
      }, 
      { status: 500 }
    )
  }
} 