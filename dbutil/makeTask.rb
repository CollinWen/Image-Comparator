require 'net/http'
require 'uri'
require 'json'
require 'securerandom'
uuid = SecureRandom.uuid
promptIdx=-1

# get the number of documents as a command line arg
ARGV.each { |arg| puts "Argument: #{arg}" }
user = ARGV[0]
i_list = ARGV[1]
task_type=ARGV[2]
promptIdx=ARGV[3]

prompts=[
  "Click on the image that represents more severe disease",
  "Which of these images has higher quality for plus disease diagnosis?"
]

promptIdx=promptIdx.to_i
puts promptIdx
if (ARGV.size <4 || promptIdx >= prompts.size ) then

    puts "Usage: ruby : #{$PROGRAM_NAME}.rb <user> <image-list name> <image-list-type> <promptIdx> <task-order> where image-list-type is either compare or classify";
    exit
end


#if task order is provided, use it otherwise task order is set to arbitrarily high number so that it shows up last
## to do: need to fix this to query database for existing tasks
if (ARGV.size > 4)
  task_order=ARGV[4]#.to_int
  task_order=task_order.strip.to_i
  puts task_order
  puts task_order.class
else
  task_order=100
end

thisPrompt=prompts[promptIdx]

obj = { type:"task",
        task_type:task_type,
        task_order:task_order,
        user:user,
        timeAdded:Time.now(),
  #    image_compare_list:image_compare_list,
  #      image_classify_list:image_classify_list,
        current_idx:0,
        completed:false,
        prompt:thisPrompt}

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
