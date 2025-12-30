# 📱 Como Incorporar a Calculadora Tarkia em WordPress via iframe

## 🎯 URL para Incorporação

```
https://tarkia.vercel.app/embed
```

**Domínio configurado:** `https://tarkia.vercel.app`

## 🔧 Método 1: Usando o Editor de Blocos do WordPress (Gutenberg)

1. **Adicione um bloco HTML personalizado:**
   - No editor do WordPress, clique em "+" para adicionar um bloco
   - Procure por "HTML Personalizado" ou "Custom HTML"
   - Cole o código abaixo:

```html
<iframe 
  src="https://tarkia.vercel.app/embed" 
  width="100%" 
  height="1200" 
  frameborder="0" 
  scrolling="auto"
  style="border: none; min-height: 1200px;"
  title="Calculadora Tarkia - Otimização Fiscal UAE"
></iframe>
```

## 🔧 Método 2: Usando Shortcode (Recomendado)

### Criar um Shortcode no functions.php do seu tema:

```php
function tarkia_calculator_iframe() {
    return '<iframe 
      src="https://tarkia.vercel.app/embed" 
      width="100%" 
      height="1200" 
      frameborder="0" 
      scrolling="auto"
      style="border: none; min-height: 1200px;"
      title="Calculadora Tarkia - Otimização Fiscal UAE"
    ></iframe>';
}
add_shortcode('tarkia_calculator', 'tarkia_calculator_iframe');
```

**Uso:** `[tarkia_calculator]` em qualquer página ou post.

## 🔧 Método 3: Usando Elementor ou Page Builder

1. Adicione um widget "HTML" ou "Code"
2. Cole o código do iframe acima
3. Ajuste a largura para 100% e altura conforme necessário

## 📐 Dimensões Recomendadas

- **Largura:** 100% (responsivo)
- **Altura mínima:** 1200px (ajuste conforme necessário)
- **Altura recomendada:** 1400px para melhor visualização

## 🎨 Estilização Personalizada

Você pode adicionar CSS personalizado no WordPress:

```css
.tarkia-iframe-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.tarkia-iframe-container iframe {
  width: 100%;
  height: 1400px;
  border: none;
}
```

## ⚙️ Configurações Avançadas

### Iframe Responsivo com JavaScript:

```html
<div class="tarkia-iframe-wrapper" style="position: relative; padding-bottom: 150%; height: 0; overflow: hidden;">
  <iframe 
    src="https://tarkia.vercel.app/embed" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
    title="Calculadora Tarkia"
  ></iframe>
</div>
```

### Com lazy loading:

```html
<iframe 
  src="https://tarkia.vercel.app/embed" 
  width="100%" 
  height="1200" 
  frameborder="0" 
  scrolling="auto"
  loading="lazy"
  style="border: none; min-height: 1200px;"
  title="Calculadora Tarkia - Otimização Fiscal UAE"
></iframe>
```

## 🔒 Segurança e Permissões

A página `/embed` está configurada para permitir incorporação via iframe de qualquer domínio. Se precisar restringir para domínios específicos, entre em contato com o suporte técnico.

## 📱 Responsividade

A calculadora é totalmente responsiva e se adapta automaticamente a diferentes tamanhos de tela. O iframe também se ajusta automaticamente em dispositivos móveis.

## 🐛 Troubleshooting

### O iframe não aparece:
1. Verifique se a URL está correta
2. Verifique se há plugins de segurança bloqueando iframes
3. Tente adicionar `sandbox="allow-scripts allow-same-origin allow-forms"` ao iframe

### O conteúdo não carrega:
1. Verifique o console do navegador para erros
2. Certifique-se de que o site está acessível publicamente
3. Verifique se há problemas de CORS

### Ajuste de altura dinâmica (opcional):

```html
<script>
window.addEventListener('message', function(event) {
  if (event.data.type === 'tarkia-height') {
    document.getElementById('tarkia-iframe').style.height = event.data.height + 'px';
  }
});
</script>

<iframe 
  id="tarkia-iframe"
  src="https://tarkia.vercel.app/embed" 
  width="100%" 
  height="1200" 
  frameborder="0" 
  scrolling="no"
  style="border: none;"
></iframe>
```

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com o suporte técnico da Tarkia.

