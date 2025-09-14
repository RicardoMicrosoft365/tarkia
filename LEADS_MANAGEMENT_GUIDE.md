# 📋 Guia de Gerenciamento de Leads - Tarkia

## 🎯 **Visão Geral**

A seção de **Leads** no painel administrativo permite visualizar, gerenciar e acompanhar todos os contatos capturados através dos formulários da calculadora Tarkia.

## 🚀 **Como Acessar**

1. **Acesse o painel administrativo**: `/admin/login`
2. **Faça login** com as credenciais: `admin` / `admin`
3. **Clique na aba "Leads"** no dashboard

## 📊 **Funcionalidades Disponíveis**

### **1. Visualização de Leads**
- ✅ **Lista completa** de todos os leads cadastrados
- ✅ **Informações de contato**: Nome, email, telefone, WhatsApp
- ✅ **Metadados**: Fonte, status, data de criação
- ✅ **Paginação** para grandes volumes de dados

### **2. Filtros e Busca**
- 🔍 **Busca por texto**: Nome, email, telefone
- 📊 **Filtro por status**: Novo, Contatado, Qualificado, Convertido, Perdido
- 📍 **Filtro por fonte**: Website, Redes Sociais, Indicação, Anúncio, Outro
- 🧹 **Limpar filtros** com um clique

### **3. Gerenciamento de Status**
- 📝 **Alterar status** diretamente na lista
- 🎯 **Status disponíveis**:
  - **Novo**: Lead recém-cadastrado
  - **Contatado**: Primeiro contato realizado
  - **Qualificado**: Lead com potencial confirmado
  - **Convertido**: Lead que virou cliente
  - **Perdido**: Lead que não evoluiu

### **4. Detalhes e Notas**
- 👁️ **Visualizar detalhes** completos do lead
- 📝 **Adicionar/editar notas** personalizadas
- 📅 **Histórico** de criação e atualização
- ✏️ **Edição inline** de informações

### **5. Ações Administrativas**
- 🗑️ **Deletar leads** (com confirmação)
- 💾 **Salvar alterações** automaticamente
- 🔄 **Atualizar lista** em tempo real

## 📋 **Estrutura dos Dados**

### **Campos do Lead**
```typescript
interface Lead {
  id: string              // UUID único
  name: string           // Nome completo
  email: string          // Email de contato
  phone?: string         // Telefone (opcional)
  whatsapp?: string      // WhatsApp (opcional)
  source: string         // Fonte do lead
  status: string         // Status atual
  notes?: string         // Notas adicionais
  createdAt: string      // Data de criação
  updatedAt: string      // Última atualização
}
```

### **Status Disponíveis**
- `new` - Novo
- `contacted` - Contatado
- `qualified` - Qualificado
- `converted` - Convertido
- `lost` - Perdido

### **Fontes Disponíveis**
- `website` - Website
- `social` - Redes Sociais
- `referral` - Indicação
- `ad` - Anúncio
- `other` - Outro

## 🔧 **API Endpoints**

### **GET /api/admin/leads**
Busca leads com filtros e paginação
```typescript
// Parâmetros de query
{
  page?: number      // Página (padrão: 1)
  limit?: number     // Itens por página (padrão: 10)
  status?: string    // Filtro por status
  source?: string    // Filtro por fonte
}

// Resposta
{
  leads: Lead[]
  total: number
  page: number
  limit: number
  totalPages: number
}
```

### **PUT /api/admin/leads**
Atualiza um lead
```typescript
// Body
{
  id: string
  status?: string
  notes?: string
}

// Resposta
{
  success: boolean
  lead: Lead
}
```

### **DELETE /api/admin/leads**
Deleta um lead
```typescript
// Query parameter
{
  id: string
}

// Resposta
{
  success: boolean
}
```

## 🎨 **Interface do Usuário**

### **Layout Responsivo**
- 📱 **Mobile-first**: Funciona em todos os dispositivos
- 🖥️ **Desktop**: Tabela completa com todas as informações
- 📊 **Cards**: Visualização otimizada para mobile

### **Estados Visuais**
- 🟦 **Novo**: Azul
- 🟨 **Contatado**: Amarelo
- 🟩 **Qualificado**: Verde
- 🟢 **Convertido**: Verde escuro
- 🟥 **Perdido**: Vermelho

### **Interações**
- ⚡ **Loading states**: Indicadores de carregamento
- ✅ **Feedback visual**: Confirmações de ações
- 🚨 **Tratamento de erros**: Mensagens claras
- 🔄 **Atualizações em tempo real**: Sem necessidade de refresh

## 📈 **Métricas e Relatórios**

### **Informações Disponíveis**
- 📊 **Total de leads** cadastrados
- 📅 **Leads por período** (data de criação)
- 📍 **Leads por fonte** (origem do contato)
- 🎯 **Leads por status** (pipeline de vendas)
- 📞 **Taxa de conversão** (convertidos/total)

### **Filtros Úteis para Análise**
- **Leads novos** (últimos 7 dias)
- **Leads qualificados** (prontos para contato)
- **Leads convertidos** (sucesso)
- **Leads por fonte** (efetividade dos canais)

## 🔒 **Segurança e Permissões**

### **Autenticação**
- 🔐 **Login obrigatório**: Apenas admins autenticados
- ⏰ **Sessão temporária**: Logout automático
- 🛡️ **Middleware de proteção**: Rotas protegidas

### **Validação de Dados**
- ✅ **Sanitização**: Dados limpos antes de salvar
- 🔍 **Validação**: Campos obrigatórios verificados
- 🚫 **Proteção**: Contra SQL injection e XSS

## 🚀 **Próximas Funcionalidades**

### **Em Desenvolvimento**
- 📊 **Dashboard de métricas** com gráficos
- 📧 **Integração com email** para contato direto
- 📱 **Notificações** de novos leads
- 📋 **Exportação** para CSV/Excel
- 🏷️ **Tags personalizadas** para categorização
- 📈 **Relatórios avançados** com filtros de data

### **Integrações Futuras**
- 📧 **Mailchimp**: Sincronização de leads
- 📱 **WhatsApp Business**: Contato direto
- 📊 **Google Analytics**: Tracking de conversões
- 💼 **CRM**: Integração com sistemas externos

## 🆘 **Suporte e Troubleshooting**

### **Problemas Comuns**

**1. Leads não aparecem**
- ✅ Verifique se há dados na tabela `leads`
- ✅ Confirme se o usuário está autenticado
- ✅ Verifique a conexão com o banco de dados

**2. Erro ao salvar alterações**
- ✅ Verifique se todos os campos obrigatórios estão preenchidos
- ✅ Confirme se o lead ainda existe no banco
- ✅ Verifique os logs do servidor

**3. Filtros não funcionam**
- ✅ Limpe os filtros e tente novamente
- ✅ Verifique se os valores estão corretos
- ✅ Recarregue a página

### **Logs e Debug**
- 📝 **Console do navegador**: Erros de JavaScript
- 🔍 **Network tab**: Requisições da API
- 📊 **Supabase logs**: Erros do banco de dados

## 📞 **Contato**

Para suporte técnico ou dúvidas sobre o sistema de leads:
- 📧 **Email**: suporte@tarkia.com
- 📱 **WhatsApp**: +55 11 99999-9999
- 🌐 **Website**: https://tarkia.com

---

**🎯 O sistema de leads está totalmente integrado e pronto para uso!**
