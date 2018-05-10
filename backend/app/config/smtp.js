var config = {};
config.development = {
  options :{
            from: 'omniseqdev@gmail.com'
  },
connectionURL:'smtps://omniseqdev@gmail.com:omniseq-sdn@2017@smtp.gmail.com'
};

config.production = {
  options :{
            from: 'omniseqdev@gmail.com'
  },
connectionURL:'smtps://omniseqdev@gmail.com:omniseq-sdn@2017@smtp.gmail.com'
};

module.exports = config; 