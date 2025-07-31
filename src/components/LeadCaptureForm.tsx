'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Phone, MessageCircle, ArrowRight, Loader2 } from 'lucide-react'

const leadSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  whatsapp: z.string().min(10, 'WhatsApp deve ter pelo menos 10 dígitos'),
  source: z.string().default('calculator'),
})

type LeadFormData = z.infer<typeof leadSchema>

interface LeadCaptureFormProps {
  onSuccess: (data: LeadFormData) => void
}

export default function LeadCaptureForm({ onSuccess }: LeadCaptureFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      source: 'calculator',
    },
  })

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Aqui você faria a chamada real para sua API
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setSubmitMessage('✅ Acesso liberado! Bem-vindo à calculadora Tarkia.')
        reset()
        onSuccess(data)
      } else {
        setSubmitMessage('❌ Erro ao processar. Tente novamente.')
      }
    } catch (error) {
      console.error('Erro ao enviar lead:', error)
      // Para o demo, vamos liberar mesmo se der erro
      setSubmitMessage('✅ Acesso liberado! Bem-vindo à calculadora Tarkia.')
      onSuccess(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Nome Completo
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              className="input-field"
              placeholder="Seu nome completo"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className="input-field"
              placeholder="seu@email.com"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Telefone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Telefone
            </label>
            <input
              {...register('phone')}
              type="tel"
              id="phone"
              className="input-field"
              placeholder="+55 11 99999-9999"
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          {/* WhatsApp */}
          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
              <MessageCircle className="w-4 h-4 inline mr-2" />
              WhatsApp
            </label>
            <input
              {...register('whatsapp')}
              type="tel"
              id="whatsapp"
              className="input-field"
              placeholder="+55 11 99999-9999"
              disabled={isSubmitting}
            />
            {errors.whatsapp && (
              <p className="mt-1 text-sm text-red-600">{errors.whatsapp.message}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Liberando Acesso...
              </>
            ) : (
              <>
                Liberar Calculadora
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Submit Message */}
        {submitMessage && (
          <div className="text-center mt-4">
            <p className={`text-sm font-medium ${
              submitMessage.includes('✅') ? 'text-green-600' : 'text-red-600'
            }`}>
              {submitMessage}
            </p>
          </div>
        )}
      </form>

      {/* Security Notice */}
      <div className="mt-8 text-center text-xs text-gray-500">
        <p className="flex items-center justify-center gap-2">
          🔒 Seus dados estão seguros e não serão compartilhados com terceiros
        </p>
      </div>
    </div>
  )
} 