const dev = {
  context: 'http://localhost:3000/'
}

const prod = {
  context: 'ec2-54-157-223-12.compute-1.amazonaws.com/'
}

export const environment = process.env.NODE_ENV === 'production'
  ? prod
  : dev
