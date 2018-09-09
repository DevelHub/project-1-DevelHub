const dev = {
  context: 'http://localhost:4000/'
}

const prod = {
  context: 'http://ec2-54-200-103-68.us-west-2.compute.amazonaws.com:4000/'
}

export const environment = process.env.NODE_ENV === 'production'
  ? prod
  : dev
