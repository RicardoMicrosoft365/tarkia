// Sistema de Geração de PDF - Calculadora Tarkia
// Usando jsPDF para geração de relatórios

class TarkiaPDFGenerator {
    constructor() {
        this.loadJsPDF();
    }
    
    loadJsPDF() {
        // Carregar jsPDF se não estiver disponível
        if (typeof jsPDF === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => {
                console.log('jsPDF carregado com sucesso');
            };
            document.head.appendChild(script);
        }
    }
    
    gerarPDFEmpresarial(dados) {
        if (typeof jsPDF === 'undefined') {
            alert('⚠️ Sistema de PDF ainda carregando. Tente novamente em alguns segundos.');
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Configurações
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        let yPosition = 30;
        
        // Cabeçalho
        doc.setFontSize(20);
        doc.setTextColor(42, 82, 152); // Azul Tarkia
        doc.text('RELATÓRIO DE ECONOMIA FISCAL', pageWidth / 2, yPosition, { align: 'center' });
        
        yPosition += 10;
        doc.setFontSize(14);
        doc.setTextColor(100, 100, 100);
        doc.text('Calculadora Tarkia UAE', pageWidth / 2, yPosition, { align: 'center' });
        
        yPosition += 20;
        
        // Informações do usuário
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('INFORMAÇÕES DO CLIENTE', margin, yPosition);
        yPosition += 10;
        
        const userData = this.getUserData();
        doc.setFontSize(10);
        doc.text(`Nome: ${userData.nome}`, margin, yPosition);
        yPosition += 6;
        doc.text(`Email: ${userData.email}`, margin, yPosition);
        yPosition += 6;
        doc.text(`Telefone: ${userData.telefone}`, margin, yPosition);
        yPosition += 15;
        
        // Dados da análise
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('ANÁLISE FISCAL EMPRESARIAL', margin, yPosition);
        yPosition += 10;
        
        doc.setFontSize(10);
        doc.text(`Faturamento Anual: $${dados.faturamento.toLocaleString()}`, margin, yPosition);
        yPosition += 6;
        doc.text(`Setor: ${dados.setor}`, margin, yPosition);
        yPosition += 6;
        doc.text(`Comparação: ${dados.compararCom === 'brazil' ? 'Brasil' : 'Portugal'} vs UAE`, margin, yPosition);
        yPosition += 15;
        
        // Resultados
        doc.setFontSize(12);
        doc.text('RESULTADOS DA ANÁLISE', margin, yPosition);
        yPosition += 10;
        
        doc.setFontSize(10);
        doc.text(`Imposto ${dados.compararCom === 'brazil' ? 'Brasil' : 'Portugal'}: $${dados.impostoOrigem.toLocaleString()}`, margin, yPosition);
        yPosition += 6;
        doc.text(`Imposto UAE: $${dados.impostoUAE.toLocaleString()}`, margin, yPosition);
        yPosition += 6;
        
        // Economia em destaque
        doc.setFontSize(14);
        doc.setTextColor(40, 167, 69); // Verde
        doc.text(`ECONOMIA ANUAL: $${dados.economia.toLocaleString()} (${dados.percentualEconomia.toFixed(1)}%)`, margin, yPosition);
        yPosition += 15;
        
        // Dias trabalhados
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Dias trabalhados para impostos:`, margin, yPosition);
        yPosition += 6;
        doc.text(`${dados.compararCom === 'brazil' ? 'Brasil' : 'Portugal'}: ${dados.diasOrigem} dias`, margin + 10, yPosition);
        yPosition += 6;
        doc.text(`UAE: ${dados.diasUAE} dias`, margin + 10, yPosition);
        yPosition += 6;
        doc.setTextColor(40, 167, 69);
        doc.text(`Economia: ${dados.diasEconomizados} dias a menos`, margin + 10, yPosition);
        yPosition += 20;
        
        // Rodapé
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('Tarkia - Consultoria especializada em planejamento tributário internacional', margin, yPosition);
        yPosition += 4;
        doc.text('tarkia.ae | contato@tarkia.ae', margin, yPosition);
        yPosition += 4;
        doc.text(`Relatório gerado em: ${new Date().toLocaleDateString('pt-BR')}`, margin, yPosition);
        
        // Salvar PDF
        const fileName = `Relatorio_Fiscal_Tarkia_${userData.nome.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
        
        // Enviar dados para CRM
        this.enviarDadosParaCRM('empresarial', dados);
    }
    
    gerarPDFImoveis(dados) {
        if (typeof jsPDF === 'undefined') {
            alert('⚠️ Sistema de PDF ainda carregando. Tente novamente em alguns segundos.');
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        let yPosition = 30;
        
        // Cabeçalho
        doc.setFontSize(20);
        doc.setTextColor(42, 82, 152);
        doc.text('RELATÓRIO DE ROI IMOBILIÁRIO', pageWidth / 2, yPosition, { align: 'center' });
        
        yPosition += 10;
        doc.setFontSize(14);
        doc.setTextColor(100, 100, 100);
        doc.text('Calculadora Tarkia UAE - Dados DLD Oficiais', pageWidth / 2, yPosition, { align: 'center' });
        
        yPosition += 20;
        
        // Informações do usuário
        const userData = this.getUserData();
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('INFORMAÇÕES DO CLIENTE', margin, yPosition);
        yPosition += 10;
        
        doc.setFontSize(10);
        doc.text(`Nome: ${userData.nome}`, margin, yPosition);
        yPosition += 6;
        doc.text(`Email: ${userData.email}`, margin, yPosition);
        yPosition += 15;
        
        // Dados do investimento
        doc.setFontSize(12);
        doc.text('ANÁLISE DE INVESTIMENTO IMOBILIÁRIO', margin, yPosition);
        yPosition += 10;
        
        doc.setFontSize(10);
        doc.text(`Investimento: $${dados.investimento.toLocaleString()}`, margin, yPosition);
        yPosition += 6;
        doc.text(`Localização: ${dados.area.replace(/_/g, ' ')}, ${dados.emirado.replace(/_/g, ' ')}`, margin, yPosition);
        yPosition += 6;
        doc.text(`Yield Anual: ${(dados.yield * 100).toFixed(1)}%`, margin, yPosition);
        yPosition += 15;
        
        // Resultados
        doc.setFontSize(12);
        doc.text('PROJEÇÃO DE RETORNOS', margin, yPosition);
        yPosition += 10;
        
        doc.setFontSize(10);
        doc.text(`Renda Mensal: $${dados.rendaMensal.toLocaleString()}`, margin, yPosition);
        yPosition += 6;
        
        doc.setFontSize(14);
        doc.setTextColor(40, 167, 69);
        doc.text(`RENDA ANUAL: $${dados.rendaAnual.toLocaleString()}`, margin, yPosition);
        yPosition += 15;
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`ROI em 5 anos: $${dados.roi5anos.toLocaleString()}`, margin, yPosition);
        yPosition += 6;
        doc.text(`ROI em 10 anos: $${dados.roi10anos.toLocaleString()}`, margin, yPosition);
        yPosition += 6;
        doc.text(`Payback: ${dados.payback.toFixed(1)} anos`, margin, yPosition);
        yPosition += 20;
        
        // Rodapé
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('Dados baseados em informações oficiais do DLD (Dubai Land Department)', margin, yPosition);
        yPosition += 4;
        doc.text('Tarkia - tarkia.ae | contato@tarkia.ae', margin, yPosition);
        yPosition += 4;
        doc.text(`Relatório gerado em: ${new Date().toLocaleDateString('pt-BR')}`, margin, yPosition);
        
        const fileName = `Relatorio_Imoveis_Tarkia_${userData.nome.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
        
        this.enviarDadosParaCRM('imoveis', dados);
    }
    
    gerarPDFCompleto(dadosEmpresarial, dadosImoveis, dadosCusto, dadosVistos) {
        if (typeof jsPDF === 'undefined') {
            alert('⚠️ Sistema de PDF ainda carregando. Tente novamente em alguns segundos.');
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        let yPosition = 30;
        
        // Cabeçalho
        doc.setFontSize(20);
        doc.setTextColor(42, 82, 152);
        doc.text('PLANEJAMENTO 360° COMPLETO', pageWidth / 2, yPosition, { align: 'center' });
        
        yPosition += 10;
        doc.setFontSize(14);
        doc.setTextColor(100, 100, 100);
        doc.text('Análise Integrada - Calculadora Tarkia UAE', pageWidth / 2, yPosition, { align: 'center' });
        
        yPosition += 20;
        
        // Informações do usuário
        const userData = this.getUserData();
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('INFORMAÇÕES DO CLIENTE', margin, yPosition);
        yPosition += 10;
        
        doc.setFontSize(10);
        doc.text(`Nome: ${userData.nome}`, margin, yPosition);
        yPosition += 6;
        doc.text(`Email: ${userData.email}`, margin, yPosition);
        yPosition += 15;
        
        // Resumo executivo
        doc.setFontSize(12);
        doc.text('RESUMO EXECUTIVO', margin, yPosition);
        yPosition += 10;
        
        const economiaFiscal = dadosEmpresarial.economia;
        const rendaImobiliaria = dadosImoveis.rendaAnual;
        const custoVidaAnual = dadosCusto.custoData.monthly_cost_usd * 12;
        const receitaTotal = economiaFiscal + rendaImobiliaria;
        const lucroLiquido = receitaTotal - custoVidaAnual;
        
        doc.setFontSize(10);
        doc.text(`Economia Fiscal Anual: $${economiaFiscal.toLocaleString()}`, margin, yPosition);
        yPosition += 6;
        doc.text(`Renda Imobiliária Anual: $${rendaImobiliaria.toLocaleString()}`, margin, yPosition);
        yPosition += 6;
        doc.text(`Custo de Vida Anual: $${custoVidaAnual.toLocaleString()}`, margin, yPosition);
        yPosition += 10;
        
        doc.setFontSize(14);
        doc.setTextColor(40, 167, 69);
        doc.text(`LUCRO LÍQUIDO ANUAL: $${lucroLiquido.toLocaleString()}`, margin, yPosition);
        yPosition += 20;
        
        // Nova página para detalhes
        doc.addPage();
        yPosition = 30;
        
        doc.setFontSize(16);
        doc.setTextColor(42, 82, 152);
        doc.text('DETALHAMENTO COMPLETO', margin, yPosition);
        yPosition += 15;
        
        // Seção Fiscal
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('1. ANÁLISE FISCAL', margin, yPosition);
        yPosition += 8;
        
        doc.setFontSize(9);
        doc.text(`• Faturamento: $${dadosEmpresarial.faturamento.toLocaleString()}`, margin + 5, yPosition);
        yPosition += 5;
        doc.text(`• Economia vs ${dadosEmpresarial.compararCom === 'brazil' ? 'Brasil' : 'Portugal'}: $${dadosEmpresarial.economia.toLocaleString()}`, margin + 5, yPosition);
        yPosition += 5;
        doc.text(`• Dias economizados: ${dadosEmpresarial.diasEconomizados} dias`, margin + 5, yPosition);
        yPosition += 10;
        
        // Seção Imobiliária
        doc.setFontSize(12);
        doc.text('2. INVESTIMENTO IMOBILIÁRIO', margin, yPosition);
        yPosition += 8;
        
        doc.setFontSize(9);
        doc.text(`• Investimento: $${dadosImoveis.investimento.toLocaleString()}`, margin + 5, yPosition);
        yPosition += 5;
        doc.text(`• Localização: ${dadosImoveis.area.replace(/_/g, ' ')}, ${dadosImoveis.emirado.replace(/_/g, ' ')}`, margin + 5, yPosition);
        yPosition += 5;
        doc.text(`• Renda anual: $${dadosImoveis.rendaAnual.toLocaleString()} (${(dadosImoveis.yield * 100).toFixed(1)}%)`, margin + 5, yPosition);
        yPosition += 10;
        
        // Seção Custo de Vida
        doc.setFontSize(12);
        doc.text('3. CUSTO DE VIDA', margin, yPosition);
        yPosition += 8;
        
        doc.setFontSize(9);
        doc.text(`• Perfil: ${dadosCusto.custoData.name}`, margin + 5, yPosition);
        yPosition += 5;
        doc.text(`• Custo mensal: $${dadosCusto.custoData.monthly_cost_usd.toLocaleString()}`, margin + 5, yPosition);
        yPosition += 5;
        doc.text(`• Custo anual: $${custoVidaAnual.toLocaleString()}`, margin + 5, yPosition);
        yPosition += 10;
        
        // Seção Vistos
        doc.setFontSize(12);
        doc.text('4. VISTO E RESIDÊNCIA', margin, yPosition);
        yPosition += 8;
        
        doc.setFontSize(9);
        doc.text(`• Tipo: ${dadosVistos.vistoData.name}`, margin + 5, yPosition);
        yPosition += 5;
        doc.text(`• Investimento mínimo: $${dadosVistos.investimentoMinimo.toLocaleString()}`, margin + 5, yPosition);
        yPosition += 5;
        doc.text(`• Custo total: $${dadosVistos.custoTotal.toLocaleString()}`, margin + 5, yPosition);
        yPosition += 15;
        
        // Rodapé
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('Relatório completo baseado em dados oficiais DLD, Property Finder e autoridades fiscais', margin, yPosition);
        yPosition += 4;
        doc.text('Tarkia - Consultoria especializada em planejamento tributário internacional', margin, yPosition);
        yPosition += 4;
        doc.text('tarkia.ae | contato@tarkia.ae | WhatsApp: +971 XX XXX XXXX', margin, yPosition);
        yPosition += 4;
        doc.text(`Relatório gerado em: ${new Date().toLocaleDateString('pt-BR')}`, margin, yPosition);
        
        const fileName = `Planejamento_360_Tarkia_${userData.nome.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
        
        this.enviarDadosParaCRM('completo', { dadosEmpresarial, dadosImoveis, dadosCusto, dadosVistos });
    }
    
    getUserData() {
        return {
            nome: document.getElementById('user-name').value || 'Cliente',
            email: document.getElementById('user-email').value || 'email@exemplo.com',
            telefone: document.getElementById('user-phone').value || 'Não informado',
            whatsapp: document.getElementById('user-whatsapp').value || 'Não informado'
        };
    }
    
    enviarDadosParaCRM(tipo, dados) {
        const userData = this.getUserData();
        
        // Dados para envio ao CRM
        const leadData = {
            nome: userData.nome,
            email: userData.email,
            telefone: userData.telefone,
            whatsapp: userData.whatsapp,
            tipo_calculo: tipo,
            dados_calculo: dados,
            timestamp: new Date().toISOString(),
            fonte: 'Calculadora Tarkia UAE'
        };
        
        // Simular envio para CRM (implementar integração real)
        console.log('Dados enviados para CRM:', leadData);
        
        // Mostrar link do WhatsApp
        this.mostrarLinkWhatsApp(userData);
        
        // Aqui você implementaria a integração real com seu CRM
        // Exemplo: fetch('/api/crm/lead', { method: 'POST', body: JSON.stringify(leadData) })
    }
    
    mostrarLinkWhatsApp(userData) {
        const whatsappNumber = '+971501234567'; // Número da Tarkia
        const message = `Olá! Acabei de usar a calculadora Tarkia e gostaria de saber mais sobre os serviços. Meu nome é ${userData.nome} e meu email é ${userData.email}.`;
        const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        
        // Mostrar modal com link do WhatsApp
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 15px; max-width: 500px; text-align: center;">
                <h3 style="color: #2a5298; margin-bottom: 15px;">📄 Relatório Gerado com Sucesso!</h3>
                <p style="margin-bottom: 20px;">Seu relatório foi baixado. Que tal conversar conosco no WhatsApp para um planejamento personalizado?</p>
                <a href="${whatsappUrl}" target="_blank" style="
                    background: #25D366;
                    color: white;
                    padding: 12px 25px;
                    border-radius: 8px;
                    text-decoration: none;
                    display: inline-block;
                    margin: 10px;
                    font-weight: bold;
                ">💬 Falar no WhatsApp</a>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: #6c757d;
                    color: white;
                    padding: 12px 25px;
                    border: none;
                    border-radius: 8px;
                    margin: 10px;
                    cursor: pointer;
                ">Fechar</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Remover modal após 10 segundos
        setTimeout(() => {
            if (modal.parentElement) {
                modal.remove();
            }
        }, 10000);
    }
}

// Instanciar gerador de PDF
const pdfGenerator = new TarkiaPDFGenerator();

// Atualizar funções de geração de PDF na calculadora
function gerarPDFEmpresarial() {
    if (!resultadosEmpresarial) {
        alert('⚠️ Primeiro calcule a economia fiscal para gerar o relatório.');
        return;
    }
    pdfGenerator.gerarPDFEmpresarial(resultadosEmpresarial);
}

function gerarPDFImoveis() {
    if (!resultadosImoveis) {
        alert('⚠️ Primeiro calcule o ROI imobiliário para gerar o relatório.');
        return;
    }
    pdfGenerator.gerarPDFImoveis(resultadosImoveis);
}

function gerarPDFCompleto() {
    if (!resultadosEmpresarial || !resultadosImoveis || !resultadosCusto || !resultadosVistos) {
        alert('⚠️ Para gerar o relatório completo, primeiro calcule todos os dados nas outras abas.');
        return;
    }
    pdfGenerator.gerarPDFCompleto(resultadosEmpresarial, resultadosImoveis, resultadosCusto, resultadosVistos);
}

