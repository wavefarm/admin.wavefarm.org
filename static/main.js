/* global setCookie,getCookie,dropCookie,queryString */
'use strict'

var cache = {
  head: document.getElementById('head'),
  controls: document.getElementById('controls'),
  main: document.getElementById('main'),
  token: getCookie('token'),
  hits: []
}


function api (method, path, data, cb) {
  if (!cb) {
    cb = data
    data = {}
  }

  var xhr = new XMLHttpRequest()
  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4) return
    var data = JSON.parse(xhr.responseText)
    if (xhr.status != 200) {
      return cb({status: xhr.status, message: data.message})
    }
    cb(null, data)
  }
  xhr.open(method, '/api/' + path)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.send(JSON.stringify(data))
}

function fieldFactory (form) {
  return function (name, value, type) {
    form.appendChild(renderLabel(name))
    form.appendChild(renderInput(name, value, type))
  }
}

function renderLabel (name) {
  var label = document.createElement('label')
  label.htmlFor = name
  label.appendChild(document.createTextNode(name))
  return label
}

function renderInput (name, value, type) {
  var input = document.createElement('input')
  input.id = name
  input.name = name
  input.value = value || ''
  input.type = type || name
  return input
}

function prepItem () {
  var el = cache.item = document.createElement('a')
  el.className = 'item'

  var publicLink = document.createElement('a')
  el.appendChild(publicLink)
  publicLink.className = 'action public'
  publicLink.target = '_blank'
  publicLink.title = 'public location'

  var header = document.createElement('h3')
  el.appendChild(header)
  var main = document.createElement('span')
  header.appendChild(main)
  main.className = 'item-main'
  header.appendChild(document.createTextNode(' '))
  var type = document.createElement('span')
  header.appendChild(type)
  type.className = 'item-type'

  var form = document.createElement('form')
  el.appendChild(form)

  var publicInput = document.createElement('input')
  form.appendChild(publicInput)
  publicInput.id = 'public'
  publicInput.name = 'public'
  publicInput.type = 'checkbox'
  var publicLabel = document.createElement('label')
  form.appendChild(publicLabel)
  publicLabel.className = 'for-check'
  publicLabel.htmlFor = 'active'
  publicLabel.appendChild(document.createTextNode('public'))

  var fields = document.createElement('div')
  fields.id = 'fields'
  form.appendChild(fields)

  var itemSaveDelete = document.createElement('div')
  form.appendChild(itemSaveDelete)
  itemSaveDelete.className = 'save-delete'
  var itemSave = document.createElement('input')
  itemSaveDelete.appendChild(itemSave)
  itemSave.className = 'action'
  itemSave.type = 'submit'
  itemSave.value = 'save'
  var itemDelete = document.createElement('input')
  itemSaveDelete.appendChild(itemDelete)
  itemDelete.type = 'button'
  itemDelete.className = 'action'
  itemDelete.value = 'delete'
}

function showItem (item) {
  if (!cache.item) prepItem()
  var el = cache.item
  cache.main.appendChild(el)

  var publicLink = el.firstChild
  publicLink.style.display = item.public ? 'block' : 'none'
  var publicUrl = 'wavefarm.org/archive/' + item.id
  publicLink.href = '//' + publicUrl
  publicLink.textContent = publicUrl

  el.querySelector('.item-main').textContent = item.main
  el.querySelector('.item-type').textContent = item.type

  el.querySelector('#public').checked = item.public

  var fields = el.querySelector('#fields')
  while (fields.firstChild) fields.removeChild(fields.firstChild)

  var field = fieldFactory(fields)

  if (item.type == 'show') {
    field('title', item.title, 'text')
    field('url', item.url)
    field('mimetype', item.mimetype, 'text')
    field('date', item.date)
    field('caption', item.caption, 'text')
    field('description', item.description, 'textarea')
    field('sites', item.sites)
    field('artists', item.artists, 'rels')
    field('collaborators', item.collaborators, 'rels')
    field('works', item.works, 'rels')
    field('events', item.events, 'rels')
    field('shows', item.shows, 'rels')
  }
}

function showHits (items) {
  var desc
  var item
  var itemCredit
  var itemDesc
  var el
  var header
  var main
  var type
  var itemLen
  var i

  itemLen = items.length
  for (i=0; i < itemLen; i++) {
    item = items[i]
    desc = item.description || item.briefDescription || item.longDescription || ''

    // Strip HTML tags from description and truncate for excerpt
    desc = desc.replace(/<[^>]*>/g, '')
    desc = desc.length > 60 ? desc.substr(0, 60) + '...' : desc

    el = document.createElement('a')
    el.className = 'item'
    el.id = item.id
    el.href = item.id

    header = document.createElement('h3')
    main = document.createElement('span')
    main.className = 'item-main'
    main.appendChild(document.createTextNode(item.main))
    header.appendChild(main)
    header.appendChild(document.createTextNode(' '))
    type = document.createElement('span')
    type.className = 'item-type'
    type.appendChild(document.createTextNode(item.type))
    header.appendChild(type)
    el.appendChild(header)

    itemCredit = document.createElement('div')
    itemCredit.className = 'credit'
    itemCredit.appendChild(document.createTextNode(item.credit || ''))
    el.appendChild(itemCredit)

    itemDesc = document.createElement('div')
    itemDesc.className = 'description'
    itemDesc.appendChild(document.createTextNode(desc))
    el.appendChild(itemDesc)

    cache.main.appendChild(el)
    cache.hits.push(el)
  }
}

function showTypes (data) {
  if (!cache.types) {
    cache.types = document.createElement('div')
    cache.types.className = 'types'
  }
  while (cache.types.firstChild) cache.types.removeChild(cache.types.firstChild)
  var typeDiv
  for (var t in data) {
    typeDiv = document.createElement('a')
    typeDiv.href = '/admin/?q=type:' + t
    typeDiv.appendChild(document.createTextNode(t))
    cache.types.appendChild(typeDiv)
    cache.types.appendChild(document.createTextNode(' '))
  }
  if (!cache.types.parentNode) cache.controls.appendChild(cache.types)
}

function logout () {
  var elems = [
    cache.count,
    cache.search,
    cache.types,
    cache.user,
    cache.item
  ]
  elems = elems.concat(cache.hits)
  elems.forEach(function (elem) {
    if (elem && elem.parentNode) {
      elem.parentNode.removeChild(elem)
    }
  })
  dropCookie('token')
  showLogin()
}

function showLogin () {
  if (!cache.login) prepLogin()
  if (!cache.login.parentNode) document.body.appendChild(cache.login)
}

function prepLogin () {
  cache.login = document.createElement('form')
  cache.login.className = 'login'

  cache.login.appendChild(renderLabel('username'))
  var userInput = renderInput('username', '', 'text')
  cache.login.appendChild(userInput)

  cache.login.appendChild(renderLabel('password'))
  var passInput = renderInput('password')
  cache.login.appendChild(passInput)

  var loginSubmit = document.createElement('input')
  loginSubmit.className = 'submit'
  loginSubmit.type = 'submit'
  loginSubmit.value = 'login'
  cache.login.appendChild(loginSubmit)

  cache.login.addEventListener('submit', function (e) {
    e.preventDefault()
    loginSubmit.disabled = true
    if (cache.errDiv && cache.errDiv.parentNode) cache.login.removeChild(cache.errDiv)
    api('POST', 'login', {username: userInput.value, password: passInput.value}, function (err, user) {
      loginSubmit.disabled = false
      if (err) {
        if (!cache.errDiv) {
          cache.errDiv = document.createElement('div')
          cache.errDiv.className = 'alert'
          cache.errDiv.appendChild(document.createTextNode('No user found with those credentials.'))
        }
        return cache.login.appendChild(cache.errDiv)
      }
      if (cache.errDiv && cache.errDiv.parentNode) cache.login.removeChild(cache.errDiv)
      setCookie('token', user.token, 100)
      setCookie('username', user.name, 100)
      setCookie('userid', user.id, 100)
      cache.login.parentNode.removeChild(cache.login)
      userInput.value = ''
      passInput.value = ''
      login()
    })
  })
}

function prepSearch () {
  cache.search = document.createElement('form')
  cache.search.className = 'search'
  cache.search.action = '/admin/'

  var searchInput = document.createElement('input')
  searchInput.id = 'q'
  searchInput.name = 'q'
  searchInput.type = 'search'
  searchInput.placeholder = 'search'
  cache.search.appendChild(searchInput)
}

function showSearch (params) {
  if (!cache.search) prepSearch()
  cache.search.elements.q.value = queryString.parse(params).q || ''
  if (!cache.search.parentNode) {
    cache.controls.appendChild(cache.search)
  }
}

function prepCount () {
  cache.count = document.createElement('div')
  cache.count.className = 'count'

  var totalSpan = document.createElement('span')
  cache.count.appendChild(totalSpan)
  cache.count.appendChild(document.createTextNode(' results'))
}

function showCount (total) {
  if (!cache.count) prepCount()
  cache.count.firstChild.textContent = total
  if (!cache.count.parentNode) cache.main.appendChild(cache.count)
}

function prepUser () {
  cache.user = document.createElement('div')
  cache.user.className = 'user'

  var nameLink = document.createElement('a')
  nameLink.className = 'username'
  cache.user.appendChild(nameLink)

  cache.user.appendChild(document.createTextNode(' '))

  var logoutLink = document.createElement('a')
  logoutLink.className = 'logout'
  logoutLink.href = ''
  logoutLink.appendChild(document.createTextNode('logout'))
  cache.user.appendChild(logoutLink)

  logoutLink.addEventListener('click', function (e) {
    e.preventDefault()
    logout()
  })
}

function showUser () {
  if (!cache.user) prepUser()
  cache.user.firstChild.textContent = getCookie('username')
  cache.user.firstChild.href = getCookie('userid')
  if (!cache.user.parentNode) {
    cache.head.insertBefore(cache.user, cache.head.firstChild)
  }
}

function login () {
  var itemId = /\w{6}/.exec(window.location.pathname)
  var params = window.location.search.substr(1)

  showUser()
  showSearch(params)
  api('GET', 'schemas', function (err, data) {showTypes(data)})

  if (itemId) {
    api('GET', itemId, function (err, item) {showItem(item)})
  } else {
    api('GET', 'search?' + params, function (err, data) {
      if (err) console.error(err)
      showCount(data.total)
      showHits(data.hits)
    })
  }
}

function initialize () {
  if (!cache.token) return showLogin()
  login()
}

initialize()
