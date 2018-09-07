const dev = {
  context: 'http://localhost:3000/'
}

const prod = {
  context: 'http:ec2-34-210-54-222.us-west-2.compute.amazonaws.com:4000/'
}

export const environment = process.env.NODE_ENV === 'production'
  ? prod
  : dev
