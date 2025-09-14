import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const source = searchParams.get('source')
    
    const offset = (page - 1) * limit

    let query = supabaseAdmin
      .from('leads')
      .select('*', { count: 'exact' })
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filtros opcionais
    if (status) {
      query = query.eq('status', status)
    }
    
    if (source) {
      query = query.eq('source', source)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Erro ao buscar leads:', error)
      return NextResponse.json({ error: 'Erro ao buscar leads' }, { status: 500 })
    }

    return NextResponse.json({
      leads: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    })
  } catch (error) {
    console.error('Erro na API de leads:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, notes } = body

    if (!id) {
      return NextResponse.json({ error: 'ID do lead é obrigatório' }, { status: 400 })
    }

    const updateData: any = {
      updatedAt: new Date().toISOString()
    }

    if (status) {
      updateData.status = status
    }

    if (notes !== undefined) {
      updateData.notes = notes
    }

    const { data, error } = await supabaseAdmin
      .from('leads')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar lead:', error)
      return NextResponse.json({ error: 'Erro ao atualizar lead' }, { status: 500 })
    }

    return NextResponse.json({ success: true, lead: data })
  } catch (error) {
    console.error('Erro na API de leads:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID do lead é obrigatório' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('leads')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar lead:', error)
      return NextResponse.json({ error: 'Erro ao deletar lead' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro na API de leads:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
