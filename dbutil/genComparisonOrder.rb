require 'net/http'
require 'uri'
require 'json'

ARGV.each { |arg| puts "Argument: #{arg}" }

numDocs = ARGV[0].to_i
res = (Array (1..numDocs)).shuffle

dbname = "rop_images/"
docname = "comparison_ordering"
url = 'http://localhost:5984/' + dbname + docname
uri = URI.parse(url)
 
http = Net::HTTP.new(uri.host, uri.port)
request = Net::HTTP::Put.new(uri.path)

resp = http.request(request, "{\"idx order\": \"#{res}\"}") 
puts resp.body





