const dev = {
  context: 'http://localhost:4000/'
}

const prod = {
  context: 'http:ec2-34-210-54-222.us-west-2.compute.amazonaws.com:8080/'
}

export const environment = process.env.NODE_ENV === 'production'
  ? prod
  : dev
