describe("Criação de Notícias", () => {
  const categories = [
    {
      id: "c52a7f7c-4f3f-48a7-b57f-a3393137e6b1",
      name: "Emprego",
      title: "Mercado de trabalho em alta: 50 mil vagas abertas em tecnologia",
      slug: "mercado-trabalho-alta-vagas-tecnologia",
      excerpt:
        "Setor de tecnologia registra crescimento de 30% nas contratações no último trimestre, com destaque para vagas de desenvolvedores e analistas de dados.",
      content:
        "O mercado de trabalho brasileiro mostra sinais de recuperação significativa, especialmente no setor de tecnologia. Segundo dados do Ministério do Trabalho, foram abertas mais de 50 mil vagas apenas no último trimestre, representando um crescimento de 30% em relação ao mesmo período do ano anterior. As principais oportunidades estão concentradas em desenvolvimento de software, análise de dados e inteligência artificial.",
      image:
        "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=450&fit=crop",
      minutes: 4,
    },
    {
      id: "37543320-1a47-4147-a9e5-21d7b39bb099",
      name: "Sociedade",
      title:
        "Programa social beneficia 2 milhões de famílias em situação de vulnerabilidade",
      slug: "programa-social-beneficia-familias-vulnerabilidade",
      excerpt:
        "Iniciativa governamental distribuiu R$ 500 milhões em auxílios emergenciais para famílias de baixa renda em todo o país.",
      content:
        'O programa social "Auxílio Emergencial Plus" alcançou um marco importante ao beneficiar mais de 2 milhões de famílias em situação de vulnerabilidade social. O investimento de R$ 500 milhões foi distribuído em parcelas de R$ 250 para cada família cadastrada. A iniciativa tem como objetivo reduzir a desigualdade social e garantir condições básicas de sobrevivência durante o período de crise econômica.',
      image:
        "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=450&fit=crop",
      minutes: 3,
    },
    {
      id: "b892c93c-3e9b-49dd-87d0-6a65dfcfdecf",
      name: "Tecnologia",
      title:
        "Nova inteligência artificial revoluciona diagnóstico médico com 95% de precisão",
      slug: "ia-revoluciona-diagnostico-medico-precisao",
      excerpt:
        "Sistema desenvolvido por pesquisadores brasileiros consegue identificar doenças em exames de imagem com precisão superior à de especialistas humanos.",
      content:
        "Uma nova inteligência artificial desenvolvida por pesquisadores da Universidade de São Paulo promete revolucionar o diagnóstico médico. O sistema, que utiliza deep learning e processamento de imagens, consegue identificar mais de 200 tipos de doenças em exames de raio-X, tomografia e ressonância magnética com 95% de precisão. A tecnologia já está sendo testada em hospitais de referência e pode reduzir significativamente o tempo de diagnóstico.",
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=450&fit=crop",
      minutes: 6,
    },
  ];

  beforeEach(() => {
    cy.login("guilhermeee314@gmail.com", "chico314");
  });

  categories.forEach((category) => {
    it(`deve criar uma notícia de ${category.name} e publicá-la imediatamente`, () => {
      cy.visit("/admin/noticias/criar");

      cy.get('[data-cy="image-url-input"]')
        .invoke("val", category.image)
        .trigger("input");
      cy.get('input[name="title"]')
        .invoke("val", category.title)
        .trigger("input");
      cy.get('input[name="slug"]').type(category.slug);
      cy.get('textarea[name="excerpt"]').type(category.excerpt);
      cy.get('[data-cy="category-select"]').select(category.id);
      cy.get('input[name="minutes"]').type(category.minutes.toString());

      cy.get('input[name="publish_now"]').check();

      cy.waitForEditorJS();
      cy.get('[data-cy="editorjs-content"]').click();
      cy.get('[data-cy="editorjs-content"] .ce-paragraph', {
        timeout: 5000,
      }).should("be.visible");
      cy.get('[data-cy="editorjs-content"] .ce-paragraph')
        .first()
        .type(category.content);

      cy.get('button[type="submit"]').click();

      cy.url().should("include", "/admin");
      cy.get("table").should("contain", category.title);
      cy.get("table").should("contain", "Publicado");
    });
  });
});
