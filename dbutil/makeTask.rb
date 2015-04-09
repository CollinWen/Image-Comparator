require 'net/http'
require 'uri'
require 'json'
require 'securerandom'
uuid = SecureRandom.uuid


# get the number of documents as a command line arg
ARGV.each { |arg| puts "Argument: #{arg}" }
user = ARGV[0]
image_compare_list = ARGV[1]

if (ARGV.size != 2) then
    puts "Usage: ruby : #{$PROGRAM_NAME}.rb <user> <image-compare-list name>";
    exit
end

obj = { type:"task",
        user:user,
        image_compare_list:image_compare_list,
        current_idx:0,
        completed:false}

puts obj.inspect
puts obj.to_json

# put the results in the database
dbname = "rop_images/"
docname = uuid
url = 'http://localhost:5984/' + dbname + docname
uri = URI.parse(url)
 
http = Net::HTTP.new(uri.host, uri.port)
request = Net::HTTP::Put.new(uri.path)

resp = http.request(request, obj.to_json) 
puts resp.body





