# Medina Cyber Security

Site institucional de [medina.seg.br](https://medina.seg.br/), recriado em React + Vite com uma
rede 3D (Three.js / React Three Fiber) que acompanha a navegação e animações de scroll em GSAP.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # build de produção + pré-renderização do HTML (dist/)
npm run preview  # serve o dist/ localmente
```

## Conteúdo preservado do site atual

Todo o texto vem do site atual, sem alterar informações factuais:

| Seção | Conteúdo | Arquivo |
| --- | --- | --- |
| Hero | “Sua empresa está realmente protegida?”, subtítulo, Firewall • Redes • VPN • Servidores • Cloud Backup • Wireless | `sections/Hero`, `data/site.js` |
| Benefits | “Uma falha na rede pode custar…”, Segurança, Continuidade, Redução de riscos, Tranquilidade | `data/benefits.js` |
| Services | Os 6 serviços e suas descrições | `data/services.js` |
| Segments | Os 14 segmentos, em duas faixas com sentidos opostos | `data/segments.js` |
| Experience | 25+ anos, 12+ anos, 60+ empresas, 200+ projetos | `data/experience.js` |
| Diagnostic | Os 7 sinais de atenção e os 3 pilares (Integridade, Disponibilidade, Segurança) | `data/diagnostic.js` |
| CTA / Footer | WhatsApp (mesma mensagem), e-mail, telefone, Instagram, área de atendimento, créditos | `data/site.js` |

Títulos curtos de apoio (“Por que importa”, “Soluções”, “Contato”…) e o rótulo “Sua operação”
no centro da topologia são apenas navegação/UI, não informações sobre a empresa.

O elemento branco grande do hero antigo e a faixa decorativa de logos cinza foram removidos.

## Arquitetura visual

A página alterna fundos azul Medina (`#2b73b8`) e branco. Uma única cena WebGL fica fixa atrás
de todo o conteúdo e se reorganiza conforme a seção visível. Os fundos das seções são pintados
**abaixo** do canvas e o conteúdo **acima** dele; o shader recebe as faixas azuis visíveis na
tela e desenha a rede em branco sobre o azul e em azul sobre o branco, trocando de cor
exatamente na borda da seção.

| Seção (`data-network-state`) | Desktop | Mobile |
| --- | --- | --- |
| `hero` | Nuvem 3D ampla à direita, parallax com o cursor | Nuvem no topo, texto abaixo |
| `benefits` | Câmera “entra” na rede, que envolve o conteúdo | Coluna vertical; a câmera desce com o scroll |
| `services` | Rede organizada como planta/piso de infraestrutura + topologia interativa em SVG | Tronco vertical com serviços em ramos (●──●) |
| `segments` | Faixa horizontal com fluxo de dados para a direita, como as faixas de segmentos | Igual, mais estreita |
| `experience` | Túnel atravessado pela câmera durante a seção | Túnel mais estreito |
| `diagnostic` | Estrutura solta; um ponto crítico acende para cada sinal lido | Coluna vertical, mesma lógica |
| `cta` | Rede converge numa esfera estável | Esfera menor acima do texto |

Cada estado é apenas um mapeamento diferente da mesma grade lógica de nós
(`components/Network3D/states.js`), por isso as conexões continuam curtas e coerentes durante as
transições. Para ajustar uma composição, edite o estado correspondente nesse arquivo.

## Estrutura

```
src/
  components/      Reutilizáveis (Header, Button, Marquee, SectionHeading, Icon, Logo…)
    Network3D/     Experiência 3D
      NetworkLayer.jsx     camada fixa, lazy-load do 3D, liga o scroll à cena
      useNetworkScroll.js  converte scroll em progresso narrativo (GSAP ScrollTrigger)
      networkStore.js      estado compartilhado DOM ↔ cena (sem re-render)
      graph.js             grade de nós, arestas, adjacência, pontos críticos
      states.js            composição de cada seção (desktop e vertical)
      Network3D.jsx        Canvas + atualização por frame
      CameraRig.jsx        câmera, travessia por seção, parallax
      Nodes.jsx / Connections.jsx / DataParticles.jsx
      shaders.js           cor por faixa azul/branca, fade de profundidade
  sections/        Uma pasta por seção, com JSX + CSS
  data/            Todo o conteúdo textual
  hooks/           useMediaQuery, useReducedMotion, useScrollAnimation
  styles/          variables.css, global.css, animations.css
scripts/prerender.js  injeta o HTML renderizado no dist/index.html (SEO e primeira pintura)
```

## Desempenho, mobile e acessibilidade

- O 3D (three + R3F) é um chunk separado, carregado quando o navegador fica ocioso; o HTML
  chega pré-renderizado, então o texto aparece antes de qualquer JavaScript.
- Mobile: menos nós e pacotes de dados, sem antialias, pixel ratio limitado e sem parallax de
  cursor. Se os primeiros frames forem lentos, o pixel ratio cai para 1 automaticamente.
- `prefers-reduced-motion`: rede estática e discreta, sem partículas nem câmera, faixas de
  segmentos viram lista, contadores e entradas não animam. Todo o conteúdo continua acessível.
- O canvas é decorativo (`aria-hidden`); toda informação existe em HTML semântico.
- Breakpoints usados no CSS: `47.5em` (mobile) e `62em` (tablet), espelhados em `src/lib/media.js`.

## Favicon

`public/favicon/` contém SVG, ICO (16/32/48), PNG 16/32, `apple-touch-icon.png` (quadrado; o
iOS arredonda os cantos) e ícones 192/512 + maskable para o manifest. Todos usam o símbolo
original da logo, em branco sobre `#2b73b8`, com reforço óptico de traço nos tamanhos pequenos.
