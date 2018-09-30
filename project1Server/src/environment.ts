const dev = {
  context: 'http://localhost:3000/'
}

const prod = {
  context: 'http://ec2-34-221-173-234.us-west-2.compute.amazonaws.com:8080/'
}

export const environment = process.env.NODE_ENV === 'production'
  ? prod
  : dev
