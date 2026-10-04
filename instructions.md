Recrie o site **Medina Cyber Security** usando o site atual como fonte de todo o conteúdo, serviços, informações e identidade: https://medina.seg.br/

Quero uma versão visualmente mais premium, moderna e tecnológica, mantendo **rigorosamente a identidade da marca**. Preserve a paleta atual, priorizando **o azul original da Medina + branco**, com preto apenas quando necessário para textos. **Não transforme o site em dark mode e não use azul-marinho como cor predominante.**

A experiência deve transmitir **infraestrutura, redes, conectividade, segurança, disponibilidade e fluxo de dados**, evitando clichês de cybersecurity como hackers, Matrix, cadeados gigantes e excesso de neon.

**Direção visual e experiência:**

- Hero impactante com uma **estrutura de rede 3D interativa**, formada por nós, conexões e pequenos fluxos de dados.
- Remova completamente o antigo grande elemento/formato branco do hero.
- Use profundidade, parallax, partículas e microinterações sutis.
- Ao rolar a página, quero a sensação de que o usuário está **navegando pela infraestrutura/rede e acompanhando o fluxo dos dados**, conectando visualmente algumas seções.
- Não exagere nas animações: o resultado deve continuar corporativo, elegante e confiável.
- Evite sequência excessiva de cards. Alterne layouts, diagramas, números, textos e elementos de rede.
- Na seção de serviços, explore uma **topologia de rede interativa**, relacionando Firewall, Redes, VPN, Servidores, Backup e Wireless.
- Preserve a ideia das duas faixas animadas de segmentos, movimentando-se em sentidos opostos.
- Use animações de entrada, counters e hover effects sutis.

**Mobile é prioridade:** não quero apenas uma versão reduzida do desktop. Crie uma experiência própria para telas pequenas, mantendo a narrativa de “navegar pela rede”. Conforme o usuário faz scroll, nós, conexões ou fluxos de dados podem acompanhar verticalmente a página e reagir às seções. Simplifique o 3D quando necessário para manter ótima performance.

Use tecnologias adequadas para essa experiência, como **Three.js** para o 3D e animações performáticas para scroll/interações. Respeite `prefers-reduced-motion`, responsividade, acessibilidade, SEO e performance. O site deve carregar rápido mesmo no mobile.

**Identidade:** mantenha a logo original sem redesenhá-la. Use **Manrope** na interface e preserve o aspecto clean da marca.

Crie também um **novo favicon de alta qualidade**, usando somente o símbolo da Medina, fundo no azul original da marca, símbolo branco e **cantos arredondados**. Gere versões adequadas para navegadores modernos e dispositivos.

Preserve também Open Graph/social sharing, WhatsApp como principal conversão e os dados reais presentes no site atual.

O objetivo final é que o visitante tenha a sensação de estar **entrando e navegando pela infraestrutura digital de uma empresa**, enquanto entende de forma clara os serviços e a experiência da Medina Cyber Security. O resultado deve parecer uma experiência web tecnológica feita sob medida, e não um template genérico de cybersecurity.

Antes de implementar, analise o site atual, identifique todo o conteúdo que deve ser preservado e proponha a nova estrutura visual. Não altere informações factuais nem a identidade da marca sem necessidade.

## STACK TÉCNICA E ARQUITETURA

Desenvolva o projeto como uma aplicação frontend moderna, organizada e fácil de manter.

Stack principal:

- React
- Vite
- JavaScript
- CSS próprio
- Three.js / React Three Fiber para experiências 3D
- GSAP + ScrollTrigger para animações ligadas ao scroll

Não utilizar Bootstrap.
Não utilizar Tailwind.
Não utilizar jQuery.
Não adicionar bibliotecas de animação redundantes se GSAP já resolver o problema.
Não usar TypeScript neste projeto.

Priorize código limpo, componentizado, performático e fácil de continuar editando manualmente depois.

### Arquitetura

Organize aproximadamente desta forma:

medina-cyber-security/
│
├── public/
│   ├── favicon/
│   │   ├── favicon.svg
│   │   ├── favicon-32x32.png
│   │   └── apple-touch-icon.png
│   ├── images/
│   │   ├── logos/
│   │   └── social/
│   └── robots.txt
│
├── src/
│   ├── assets/
│   │   ├── icons/
│   │   └── images/
│   │
│   ├── components/
│   │   ├── Header/
│   │   ├── Button/
│   │   ├── Marquee/
│   │   └── Network3D/
│   │       ├── Network3D.jsx
│   │       ├── Nodes.jsx
│   │       ├── Connections.jsx
│   │       └── DataParticles.jsx
│   │
│   ├── sections/
│   │   ├── Hero/
│   │   ├── Benefits/
│   │   ├── Services/
│   │   ├── Segments/
│   │   ├── Experience/
│   │   ├── Diagnostic/
│   │   ├── CTA/
│   │   └── Footer/
│   │
│   ├── hooks/
│   │   ├── useReducedMotion.js
│   │   └── useMediaQuery.js
│   │
│   ├── data/
│   │   ├── services.js
│   │   └── segments.js
│   │
│   ├── styles/
│   │   ├── variables.css
│   │   ├── global.css
│   │   └── animations.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── package.json
└── vite.config.js

A estrutura pode ser ajustada se houver justificativa técnica, mas mantenha separação clara entre componentes reutilizáveis, seções, conteúdo, estilos e experiência 3D.

## COMPONENTIZAÇÃO

O App.jsx deve funcionar principalmente como composição da página:

<Header />
<main>
<Hero />
<Benefits />
<Services />
<Segments />
<Experience />
<Diagnostic />
<CTA />
</main>
<Footer />

Não concentre toda a aplicação em App.jsx.

Cada seção importante deve possuir seu próprio componente e seus estilos.

Componentes reutilizáveis devem ficar separados das seções.

Dados repetitivos, como serviços e segmentos atendidos, devem ficar em arquivos dentro de /data e ser renderizados dinamicamente, evitando HTML/JSX repetitivo.

## SISTEMA VISUAL

Centralize as principais definições visuais em variables.css.

Use como base:

:root {
--color-primary: #2b73b8;
--color-white: #ffffff;
--color-black: #111111;

```
--font-primary: "Manrope", sans-serif;

--container-width: 1200px;

--radius-sm: 8px;
--radius-md: 16px;
--radius-lg: 24px;
```

}

Use o azul oficial da Medina (#2b73b8) como principal cor da identidade.

Podem existir variações sutis quando tecnicamente necessárias para profundidade, transparência ou interação, mas NÃO crie uma nova paleta baseada em azul-marinho, roxo, cyan ou neon.

A experiência deve continuar sendo predominantemente azul Medina + branco.

Não criar dark mode como identidade principal.

## EXPERIÊNCIA 3D

A experiência 3D deve ser parte estrutural da narrativa do site, e não apenas uma animação decorativa isolada no Hero.

Utilize Three.js através de React Three Fiber quando isso facilitar integração, manutenção e performance.

Crie uma arquitetura própria para Network3D, separando responsabilidades como:

- nós;
- conexões;
- partículas/fluxos de dados;
- câmera;
- interação;
- estados relacionados ao scroll.

Evite criar várias cenas WebGL pesadas independentes ao longo da página.

Prefira, quando tecnicamente adequado, uma experiência 3D principal capaz de mudar de composição/estado conforme o usuário navega pelas seções.

Exemplo conceitual:

Hero → rede ampla e tridimensional
Services → rede reorganizada como topologia de infraestrutura
Experience → fluxo atravessando a estrutura
Diagnostic → pontos críticos/riscos destacados
CTA → rede estabilizada/convergindo

A transição deve transmitir a sensação de que estamos navegando pela mesma infraestrutura digital durante a página.

Não transformar o site em jogo ou demonstração de WebGL. O 3D deve apoiar a comunicação comercial.

## SCROLL E ANIMAÇÕES

Utilize GSAP + ScrollTrigger para animações importantes ligadas ao scroll.

O scroll pode controlar:

- câmera;
- posição/profundidade da rede;
- ativação de nós;
- fluxo de partículas;
- entrada de conteúdo;
- counters;
- linhas/conexões;
- transições entre estados da infraestrutura.

Evite animações excessivas.

Não faça todos os elementos surgirem da mesma maneira.

Priorize movimentos suaves, intencionais e relacionados à narrativa.

Microinterações devem ser rápidas e discretas.

Não adicionar Framer Motion/Motion apenas para pequenas animações que GSAP e CSS já resolvem.

## MOBILE

Mobile NÃO deve ser apenas o layout desktop reduzido.

Desenvolva uma experiência específica para telas pequenas.

No desktop, a rede pode explorar largura, profundidade, cursor e perspectiva.

No mobile, transforme a narrativa da rede em uma experiência mais vertical.

Conforme o usuário faz scroll, deve existir a sensação de estar descendo/percorrendo a infraestrutura e acompanhando o fluxo dos dados.

Conceitualmente:

●
│
●──●
│
●
│
●──●
│
●

Os nós/conexões podem acompanhar visualmente as seções e reagir à posição do scroll.

No mobile:

- reduzir quantidade de partículas;
- reduzir geometria;
- reduzir efeitos de blur;
- evitar processamento desnecessário;
- não depender de hover;
- utilizar interações touch quando fizer sentido;
- preservar fluidez do scroll;
- adaptar a câmera/composição 3D;
- priorizar legibilidade e conversão.

Não simplesmente esconder toda a experiência 3D no celular.

Crie uma versão otimizada dela.

## PERFORMANCE

Performance é requisito do projeto.

O site deve permanecer fluido principalmente em smartphones intermediários.

Implementar quando apropriado:

- lazy loading;
- carregamento otimizado de assets;
- SVG para elementos vetoriais;
- imagens modernas e comprimidas;
- redução de pixel ratio do WebGL quando necessário;
- redução dinâmica de complexidade em mobile;
- reutilização de geometria/material;
- cleanup correto de listeners e animações;
- pausa ou redução de renderização quando elementos 3D não estiverem visíveis;
- IntersectionObserver quando adequado.

Evite loops, listeners e animações desnecessárias.

Não sacrifique usabilidade por efeitos visuais.

## ACESSIBILIDADE E MOVIMENTO

Respeitar:

@media (prefers-reduced-motion: reduce)

Usuários que preferem movimento reduzido devem continuar conseguindo navegar normalmente.

Nesse modo:

- remover movimentos intensos de câmera;
- reduzir/desativar parallax;
- reduzir animações contínuas;
- preservar todo o conteúdo e funcionalidade.

Utilize HTML semântico, contraste adequado, navegação por teclado, estados de focus e atributos ARIA quando necessários.

Canvas/3D nunca deve ser a única forma de comunicar uma informação importante.

## RESPONSIVIDADE

Não desenvolver apenas para breakpoints específicos.

O layout deve funcionar de forma fluida entre diferentes tamanhos de tela.

Utilize CSS moderno, incluindo quando adequado:

- clamp()
- min()
- max()
- grid
- flexbox
- aspect-ratio
- CSS custom properties

Evite valores fixos desnecessários que quebrem em resoluções intermediárias.

## SEO E SOCIAL SHARING

Mesmo sendo React/Vite, preserve corretamente:

- title;
- meta description;
- canonical;
- Open Graph;
- og:image;
- Twitter/X cards quando apropriado;
- favicon;
- robots.txt;
- estrutura semântica de headings.

Utilize o conteúdo real do site atual como referência para os metadados.

Não invente informações da empresa.

## FAVICON

Crie um novo favicon de alta qualidade baseado SOMENTE no símbolo gráfico existente da Medina Cyber Security.

Não redesenhe o símbolo.

Características:

- fundo #2b73b8;
- símbolo original em branco;
- formato quadrado;
- cantos arredondados;
- excelente legibilidade em tamanhos pequenos;
- margens internas equilibradas.

Preparar pelo menos:

- favicon.svg;
- favicon.ico quando necessário;
- favicon-32x32.png;
- apple-touch-icon.png.

O favicon deve permanecer reconhecível em tamanhos pequenos.

## MANUTENIBILIDADE

O projeto será posteriormente mantido e editado manualmente.

Portanto:

- não gerar componentes gigantes;
- não misturar toda a lógica 3D com conteúdo textual;
- não duplicar conteúdo;
- não utilizar números mágicos sem necessidade;
- comentar apenas trechos tecnicamente complexos;
- utilizar nomes claros para componentes, classes e funções;
- remover código morto;
- não deixar dependências não utilizadas;
- não adicionar bibliotecas apenas por conveniência.

O resultado deve parecer um projeto profissional desenvolvido de forma intencional, e não código gerado rapidamente por IA.

## ORDEM DE EXECUÇÃO

Antes de começar a implementação:

1. Analise https://medina.seg.br/ e identifique o conteúdo e informações que precisam ser preservados.
2. Defina a nova arquitetura visual da página.
3. Defina como a rede 3D se transforma ao longo do scroll.
4. Defina separadamente o comportamento desktop e mobile.
5. Estruture componentes e dados.
6. Só então implemente o projeto.

Não altere informações factuais sobre Marcos Medina ou Medina Cyber Security sem base no site atual.

Não invente clientes, certificações, números, depoimentos, serviços ou resultados.

O objetivo técnico é combinar uma experiência visual de alto nível com código que permaneça compreensível, organizado, rápido e fácil de manter.