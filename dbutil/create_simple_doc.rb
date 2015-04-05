require 'net/http'
require 'uri'
require 'json'

#image ids
imgids = [3, 1, 4]

dbname = "rop_images/"
docname = "image_subset"
url = 'http://localhost:5984/' + dbname + docname
uri = URI.parse(url)
 
http = Net::HTTP.new(uri.host, uri.port)
request = Net::HTTP::Put.new(uri.path)

resp = http.request(request, "{\"idx order\": \"#{imgids}\"}") 
puts resp.body