'use client'

import { useState } from 'react'
import { 
  Users, 
  Mail, 
  Phone, 
  MessageSquare, 
  Calendar, 
  Filter, 
  Search,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { useLeads } from '@/hooks/useLeads'

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

const statusConfig = {
  new: { label: 'Novo', color: 'bg-blue-100 text-blue-800', icon: Clock },
  contacted: { label: 'Contatado', color: 'bg-yellow-100 text-yellow-800', icon: MessageSquare },
  qualified: { label: 'Qualificado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  converted: { label: 'Convertido', color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
  lost: { label: 'Perdido', color: 'bg-red-100 text-red-800', icon: XCircle }
}

const sourceConfig = {
  website: { label: 'Website', color: 'bg-purple-100 text-purple-800' },
  social: { label: 'Redes Sociais', color: 'bg-pink-100 text-pink-800' },
  referral: { label: 'Indicação', color: 'bg-indigo-100 text-indigo-800' },
  ad: { label: 'Anúncio', color: 'bg-orange-100 text-orange-800' },
  other: { label: 'Outro', color: 'bg-gray-100 text-gray-800' }
}

export default function LeadsManager() {
  const { leads, total, page, totalPages, isLoading, error, fetchLeads, updateLead, deleteLead } = useLeads()
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [filters, setFilters] = useState({
    status: '',
    source: '',
    search: ''
  })
  const [editingNotes, setEditingNotes] = useState(false)
  const [notes, setNotes] = useState('')

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    const success = await updateLead(leadId, newStatus)
    if (success) {
      // Atualizar a lista
      fetchLeads(page, filters.status, filters.source)
    }
  }

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead)
    setNotes(lead.notes || '')
    setShowModal(true)
  }

  const handleSaveNotes = async () => {
    if (selectedLead) {
      const success = await updateLead(selectedLead.id, selectedLead.status, notes)
      if (success) {
        setEditingNotes(false)
        setShowModal(false)
        fetchLeads(page, filters.status, filters.source)
      }
    }
  }

  const handleDeleteLead = async (leadId: string) => {
    if (confirm('Tem certeza que deseja deletar este lead?')) {
      const success = await deleteLead(leadId)
      if (success) {
        fetchLeads(page, filters.status, filters.source)
      }
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    fetchLeads(1, newFilters.status, newFilters.source)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredLeads = leads.filter(lead => {
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      return (
        lead.name.toLowerCase().includes(searchTerm) ||
        lead.email.toLowerCase().includes(searchTerm) ||
        (lead.phone && lead.phone.includes(searchTerm)) ||
        (lead.whatsapp && lead.whatsapp.includes(searchTerm))
      )
    }
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-primary-600" />
            Gerenciamento de Leads
          </h3>
          <p className="text-gray-600 mt-1">
            {total} leads cadastrados
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Busca */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="input-field pl-10"
                placeholder="Nome, email, telefone..."
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="input-field"
            >
              <option value="">Todos os status</option>
              {Object.entries(statusConfig).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>

          {/* Fonte */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fonte
            </label>
            <select
              value={filters.source}
              onChange={(e) => handleFilterChange('source', e.target.value)}
              className="input-field"
            >
              <option value="">Todas as fontes</option>
              {Object.entries(sourceConfig).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>

          {/* Ações */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilters({ status: '', source: '', search: '' })
                fetchLeads(1)
              }}
              className="btn-secondary w-full"
            >
              <Filter className="w-4 h-4 mr-2" />
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Leads */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando leads...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">{error}</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-8 h-8 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum lead encontrado</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lead
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fonte
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeads.map((lead) => {
                    const StatusIcon = statusConfig[lead.status as keyof typeof statusConfig]?.icon || Clock
                    const statusColor = statusConfig[lead.status as keyof typeof statusConfig]?.color || 'bg-gray-100 text-gray-800'
                    const sourceColor = sourceConfig[lead.source as keyof typeof sourceConfig]?.color || 'bg-gray-100 text-gray-800'
                    
                    return (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {lead.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {lead.id.slice(0, 8)}...
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-900">
                              <Mail className="w-4 h-4 mr-2 text-gray-400" />
                              {lead.email}
                            </div>
                            {lead.phone && (
                              <div className="flex items-center text-sm text-gray-500">
                                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                {lead.phone}
                              </div>
                            )}
                            {lead.whatsapp && (
                              <div className="flex items-center text-sm text-gray-500">
                                <MessageSquare className="w-4 h-4 mr-2 text-green-500" />
                                {lead.whatsapp}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                            className={`text-xs px-2 py-1 rounded-full border-0 ${statusColor} focus:ring-2 focus:ring-primary-500`}
                          >
                            {Object.entries(statusConfig).map(([key, config]) => (
                              <option key={key} value={key}>
                                {config.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${sourceColor}`}>
                            {sourceConfig[lead.source as keyof typeof sourceConfig]?.label || lead.source}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {formatDate(lead.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewLead(lead)}
                              className="text-primary-600 hover:text-primary-900"
                              title="Ver detalhes"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Deletar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => fetchLeads(page - 1, filters.status, filters.source)}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => fetchLeads(page + 1, filters.status, filters.source)}
                    disabled={page === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Próximo
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando <span className="font-medium">{((page - 1) * 10) + 1}</span> até{' '}
                      <span className="font-medium">
                        {Math.min(page * 10, total)}
                      </span>{' '}
                      de <span className="font-medium">{total}</span> resultados
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => fetchLeads(page - 1, filters.status, filters.source)}
                        disabled={page === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Anterior
                      </button>
                      <button
                        onClick={() => fetchLeads(page + 1, filters.status, filters.source)}
                        disabled={page === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Próximo
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de Detalhes */}
      {showModal && selectedLead && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Detalhes do Lead
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedLead.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedLead.email}</p>
                  </div>
                  {selectedLead.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Telefone</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedLead.phone}</p>
                    </div>
                  )}
                  {selectedLead.whatsapp && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedLead.whatsapp}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={selectedLead.status}
                      onChange={(e) => {
                        setSelectedLead({ ...selectedLead, status: e.target.value })
                        handleStatusChange(selectedLead.id, e.target.value)
                      }}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <option key={key} value={key}>
                          {config.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fonte</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {sourceConfig[selectedLead.source as keyof typeof sourceConfig]?.label || selectedLead.source}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Data de Criação</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedLead.createdAt)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Última Atualização</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedLead.updatedAt)}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Notas</label>
                    <button
                      onClick={() => setEditingNotes(!editingNotes)}
                      className="text-primary-600 hover:text-primary-900 text-sm"
                    >
                      <Edit className="w-4 h-4 inline mr-1" />
                      {editingNotes ? 'Cancelar' : 'Editar'}
                    </button>
                  </div>
                  {editingNotes ? (
                    <div className="space-y-2">
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="Adicione notas sobre este lead..."
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingNotes(false)}
                          className="btn-secondary"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleSaveNotes}
                          className="btn-primary"
                        >
                          Salvar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedLead.notes || 'Nenhuma nota adicionada'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
