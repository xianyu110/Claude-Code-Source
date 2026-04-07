const counters = document.querySelectorAll('.stat-card')
const particleRoot = document.getElementById('particles')
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function formatCount(value) {
  return new Intl.NumberFormat('zh-CN').format(value)
}

function animateCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return

      const card = entry.target
      const numberEl = card.querySelector('.stat-number')
      const target = Number(card.dataset.count || 0)
      const duration = prefersReducedMotion ? 0 : 1200
      const startAt = performance.now()

      const tick = (now) => {
        if (duration === 0) {
          numberEl.textContent = formatCount(target)
          return
        }

        const progress = Math.min((now - startAt) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        numberEl.textContent = formatCount(Math.round(target * eased))
        if (progress < 1) requestAnimationFrame(tick)
      }

      requestAnimationFrame(tick)
      observer.unobserve(card)
    })
  }, { threshold: 0.35 })

  counters.forEach((card) => observer.observe(card))
}

function spawnParticles() {
  if (!particleRoot || prefersReducedMotion) return

  const colors = ['var(--accent)', 'var(--accent-2)', 'var(--warning)']
  for (let i = 0; i < 18; i += 1) {
    const node = document.createElement('span')
    node.className = 'pixel-particle'
    node.style.left = `${Math.random() * 100}%`
    node.style.top = `${30 + Math.random() * 70}%`
    node.style.animationDuration = `${4 + Math.random() * 5}s`
    node.style.animationDelay = `${Math.random() * 5}s`
    node.style.background = colors[i % colors.length]
    particleRoot.appendChild(node)
  }
}

function activateCurrentNav() {
  const links = [...document.querySelectorAll('.nav a')]
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean)

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      const activeId = `#${entry.target.id}`
      links.forEach((link) => {
        link.style.color = link.getAttribute('href') === activeId ? 'var(--accent)' : ''
        link.style.borderColor = link.getAttribute('href') === activeId ? 'var(--accent)' : 'transparent'
      })
    })
  }, {
    rootMargin: '-30% 0px -50% 0px',
    threshold: 0.1,
  })

  sections.forEach((section) => observer.observe(section))
}

animateCounters()
spawnParticles()
activateCurrentNav()
