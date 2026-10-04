// Topology coordinates (x, y) live in a 0–100 space shared by the SVG links and the node buttons.
export const services = [
  {
    id: 'firewall',
    icon: 'firewall',
    title: 'Firewall e Segurança de Redes',
    shortTitle: 'Firewall',
    description: 'Proteção e controle dos acessos à rede.',
    position: { x: 50, y: 9 },
  },
  {
    id: 'redes',
    icon: 'network',
    title: 'Redes e Infraestrutura',
    shortTitle: 'Redes',
    description: 'Planejamento e estruturação de redes estáveis e seguras.',
    position: { x: 87, y: 30 },
  },
  {
    id: 'vpn',
    icon: 'vpn',
    title: 'VPN e Acesso Seguro',
    shortTitle: 'VPN',
    description: 'Conexões seguras entre equipes e unidades.',
    position: { x: 87, y: 70 },
  },
  {
    id: 'servidores',
    icon: 'server',
    title: 'Servidores',
    shortTitle: 'Servidores',
    description: 'Estrutura para recursos e serviços empresariais.',
    position: { x: 50, y: 91 },
  },
  {
    id: 'backup',
    icon: 'backup',
    title: 'Backup e Proteção de Dados',
    shortTitle: 'Backup',
    description: 'Proteção e disponibilidade das informações.',
    position: { x: 13, y: 70 },
  },
  {
    id: 'wireless',
    icon: 'wireless',
    title: 'Wireless',
    shortTitle: 'Wireless',
    description: 'Conectividade corporativa segura e estável.',
    position: { x: 13, y: 30 },
  },
]

export const servicesHub = { label: 'Sua operação', position: { x: 50, y: 50 } }
