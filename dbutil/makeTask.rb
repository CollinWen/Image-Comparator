require 'net/http'
require 'uri'
require 'json'
require 'securerandom'
uuid = SecureRandom.uuid


# get the number of documents as a command line arg
ARGV.each { |arg| puts "Argument: #{arg}" }
user = ARGV[0]
i_list = ARGV[1]
task_type=ARGV[2]

if (ARGV.size != 3) then
    puts "Usage: ruby : #{$PROGRAM_NAME}.rb <user> <image-list name> <image-list-type> where image-list-type is eihter compare or classify";
    exit
end


obj = { type:"task",
        task_type:task_type,
        user:user,
  #    image_compare_list:image_compare_list,
  #      image_classify_list:image_classify_list,
        current_idx:0,
        completed:false}

if task_type=="compare"
  obj["image_compare_list"]=i_list
elsif task_type=="classify"
  obj["image_classify_list"]=i_list
else
  puts "refer to help"
  exit
end




# need to change icl in db to reflect



#puts obj.inspect
#puts obj.to_json


# put the results in the database
dbname = "rop_images/"
docname = uuid
url = 'http://localhost:5984/' + dbname + docname
uri = URI.parse(url)

http = Net::HTTP.new(uri.host, uri.port)
request = Net::HTTP::Put.new(uri.path)

resp = http.request(request, obj.to_json)
puts resp.body
