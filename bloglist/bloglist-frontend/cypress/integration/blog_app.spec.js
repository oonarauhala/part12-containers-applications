// Backend to be run in dev mode (npm run dev)
// npm run cypress:op

describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      username: 'Testi',
      name: 'T. Testaaja',
      password: 'asdf',
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  describe('Login', function () {
    it('Login form is shown', function () {
      cy.contains('log in')
      cy.contains('username')
      cy.contains('password')
      cy.contains('login')
    })

    it('succeeds with correct credentials', function () {
      cy.get('#username').type('Testi')
      cy.get('#password').type('asdf')
      cy.contains('login').click()
      cy.contains('T. Testaaja logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('Väärä')
      cy.get('#password').type('salasana')
      cy.contains('login').click()
      cy.contains('Wrong username or password')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'Testi', password: 'asdf' })
    })

    it('a blog can be created', function () {
      cy.contains('New blog').click()
      cy.get('#blogTitle').type('End to end testing for beginners')
      cy.get('#blogAuthor').type('Master test writer')
      cy.get('#blogUrl').type('testing.net')
      cy.get('#create-button').click()
      cy.contains(
        'New blog End to end testing for beginners by Master test writer added!'
      )
      cy.get('.blogsList').contains('End to end testing for beginners')
    })
    describe('and when two blogs exist', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'End to end testing for beginners',
          author: 'Master test writer',
          url: 'testing.net',
        })
        cy.createBlog({
          title: 'React testing',
          author: 'React dev',
          url: 'reactblog.fr',
        })
      })
      it('a blog can be liked', function () {
        cy.contains('React testing').parent().as('blogContent')
        cy.get('@blogContent').find('button').contains('view').click()
        cy.get('@blogContent').find('button').contains('like').click()
        cy.get('@blogContent').find('div').contains('1')
      })

      it('blog owner can remove blog', function () {
        cy.contains('React testing').parent().as('blogContent')
        cy.get('@blogContent').find('button').contains('view').click()
        cy.get('@blogContent').find('button').contains('remove').click()
        cy.get('html').should('not.contain', 'React testing')
      })

      it('blogs are ordered by likes', function () {
        cy.contains('React testing').parent().as('blogContent')
        cy.get('@blogContent').find('button').contains('view').click()
        cy.get('@blogContent').find('button').contains('like').click()
        cy.get('@blogContent').find('button').contains('hide').click()
        cy.get('#blogInShort').first().contains('React testing')
      })
    })
  })
})
