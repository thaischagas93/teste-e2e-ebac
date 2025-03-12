//<reference types="cypress" />
import produtosPage from "../support/page_objects/produtos.page";
import { faker } from '@faker-js/faker';

context('Exercicio - Testes End-to-end - Fluxo de pedido', () => {
    
  beforeEach(() => {
      cy.visit('http://lojaebac.ebaconline.art.br/produtos')
  });

  it('Fluxo de pedido para compra de 4 produtos', () => {
    produtosPage.buscarProduto('Argus All-Weather Tank')
    produtosPage.addProdutoCarrinho('S', 'Gray', 1)
    cy.get('.woocommerce-message').should('contain', '“Argus All-Weather Tank” foi adicionado no seu carrinho.')

    let qtd = 2
    produtosPage.buscarProduto('Aether Gym Pant')
    produtosPage.addProdutoCarrinho('32', 'Blue', qtd)
    cy.get('.woocommerce-message').should('contain', qtd + ' × “Aether Gym Pant” foram adicionados no seu carrinho.')

    cy.fixture('produtos').then(dados => {
        produtosPage.buscarProduto(dados[2].nomeProduto)
        produtosPage.addProdutoCarrinho(
            dados[2].tamanho, 
            dados[2].cor, 
            dados[2].quantidade)
        cy.get('.woocommerce-message').should('contain', dados[2].nomeProduto)
    })

    cy.get('#cart > .dropdown-toggle').click()
    cy.get('#cart > .dropdown-menu > .widget_shopping_cart_content > .mini_cart_content > .mini_cart_inner > .mcart-border > .buttons > .checkout').click()
   
    cy.get('#billing_first_name').type(faker.person.firstName())
    cy.get('#billing_last_name').type(faker.person.lastName())
    cy.get('#billing_company').type(faker.company.name())
    cy.get('#select2-billing_country-container').should('exist')    
    cy.get('#billing_address_1').type(faker.location.streetAddress())
    cy.get('#billing_address_2').type(faker.location.secondaryAddress())
    cy.get('#billing_city').type(faker.location.city())
    cy.get('#select2-billing_state-container').should('exist')
    cy.get('#billing_postcode').type(faker.location.zipCode('########'))
    cy.get('#billing_phone').type(faker.phone.number({style: 'international'}) || '+12345678912');
    cy.get('#billing_email').type(faker.internet.email())
    cy.get('#createaccount').click()
    cy.get('#account_password').type(faker.internet.password())
    cy.get('#payment_method_bacs').click()
    cy.get('#terms').click()
    cy.get('#place_order').click( { force:true } )
    cy.get('.woocommerce-thankyou-order-received').should('contain', 'Obrigado. Seu pedido foi recebido.')
   
           
    });
    
  });
