export type NewsItem = {
  category: string;
  color: string;
  title: string;
  excerpt: string;
  minutes: number;
  date: string;
  image: string;
  href?: string;
};

export const featuredLead = {
  image: "https://picsum.photos/seed/news-hero/1200/800",
  category: "Emprego",
  meta: "15 Jan 2024 • 5 min",
  date: "15 Jan 2024",
  minutes: 5,
  title:
    "OpenAI Anuncia Grandes Demissões Após Automação de 40% dos Empregos em Tech",
  excerpt:
    "Empresa líder em IA revela que seus próprios sistemas automatizaram significativa parte de suas operações internas, levando a cortes massivos na força de trabalho.",
  href: "/noticias/openai-demissoes-automatizacao",
};

export const newsCards: NewsItem[] = [
  {
    category: "Tecnologia",
    color: "bg-[color:var(--color-primary)]",
    title: "Google Desenvolve IA que Substitui 70% dos Programadores Júnior",
    excerpt:
      "Novo sistema consegue criar código complexo automaticamente, ameaçando milhares de postos de trabalho na área de desenvolvimento.",
    minutes: 4,
    date: "12 Jan 2024",
    image: "https://picsum.photos/seed/analytics/800/450",
    href: "/noticias/google-ia-substitui-junior",
  },
  {
    category: "Sociedade",
    color: "bg-[color:var(--color-primary)]",
    title: "Estudo Revela: IA Pode Eliminar 25% dos Empregos até 2030",
    excerpt:
      "Pesquisa do MIT aponta que inteligência artificial deve impactar drasticamente o mercado de trabalho nos próximos anos.",
    minutes: 6,
    date: "13 Jan 2024",
    image: "https://picsum.photos/seed/dashboard/800/450",
    href: "/noticias/estudo-ia-25-empregos",
  },
  {
    category: "Tecnologia",
    color: "bg-[color:var(--color-primary)]",
    title: "Chips Neurais: A Nova Fronteira da Computação Chegou",
    excerpt:
      "Processadores que imitam o cérebro humano prometem revolucionar a velocidade e eficiência dos sistemas de IA.",
    minutes: 5,
    date: "12 Jan 2024",
    image: "https://picsum.photos/seed/vr-lab/800/450",
    href: "/noticias/chips-neurais-fronteira",
  },
  {
    category: "Emprego",
    color: "bg-[color:var(--color-primary)]",
    title: "Robôs Humanoides Começam a Trabalhar em Fábricas Brasileiras",
    excerpt:
      "Primeira linha de produção totalmente automatizada com robôs humanoides entra em operação no ABC Paulista.",
    minutes: 4,
    date: "11 Jan 2024",
    image: "https://picsum.photos/seed/cockpit/800/450",
    href: "/noticias/robos-humanoides-fabricas",
  },
  {
    category: "Sociedade",
    color: "bg-[color:var(--color-primary)]",
    title: "IA Generativa Muda Completamente o Ensino Universitário",
    excerpt:
      "Universidades brasileiras adaptam currículos e métodos de avaliação para nova realidade da inteligência artificial.",
    minutes: 5,
    date: "10 Jan 2024",
    image: "https://picsum.photos/seed/students/800/450",
    href: "/noticias/ia-ensino-universitario",
  },
  {
    category: "Tecnologia",
    color: "bg-[color:var(--color-primary)]",
    title: "Quantum Computing: IBM Anuncia Breakthrough Histórico",
    excerpt:
      "Novo processador quântico de 1000 qubits promete acelerar desenvolvimento de IA em cloud.",
    minutes: 4,
    date: "9 Jan 2024",
    image: "https://picsum.photos/seed/aws-datacenter/800/450",
    href: "/noticias/ibm-breakthrough-quantum",
  },
];
