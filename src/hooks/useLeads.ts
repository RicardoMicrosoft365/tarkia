import { useState, useEffect } from 'react'

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  whatsapp?: string
  source: string
  status: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface LeadsResponse {
  leads: Lead[]
  total: number
  page: number
  limit: number
  totalPages: number
}

interface UseLeadsReturn {
  leads: Lead[]
  total: number
  page: number
  totalPages: number
  isLoading: boolean
  error: string | null
  fetchLeads: (page?: number, status?: string, source?: string) => Promise<void>
  updateLead: (id: string, status: string, notes?: string) => Promise<boolean>
  deleteLead: (id: string) => Promise<boolean>
}

export function useLeads(): UseLeadsReturn {
  const [leads, setLeads] = useState<Lead[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLeads = async (pageNum: number = 1, status?: string, source?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '10'
      })

      if (status) params.append('status', status)
      if (source) params.append('source', source)

      const response = await fetch(`/api/admin/leads?${params}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar leads')
      }

      const data: LeadsResponse = await response.json()
      
      setLeads(data.leads)
      setTotal(data.total)
      setPage(data.page)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setIsLoading(false)
    }
  }

  const updateLead = async (id: string, status: string, notes?: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/leads', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, status, notes })
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar lead')
      }

      // Atualizar o lead na lista local
      setLeads(prev => prev.map(lead => 
        lead.id === id 
          ? { ...lead, status, notes: notes || lead.notes, updatedAt: new Date().toISOString() }
          : lead
      ))

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar lead')
      return false
    }
  }

  const deleteLead = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/leads?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar lead')
      }

      // Remover o lead da lista local
      setLeads(prev => prev.filter(lead => lead.id !== id))
      setTotal(prev => prev - 1)

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar lead')
      return false
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  return {
    leads,
    total,
    page,
    totalPages,
    isLoading,
    error,
    fetchLeads,
    updateLead,
    deleteLead
  }
}
