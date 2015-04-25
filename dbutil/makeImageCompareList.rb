require 'net/http'
require 'uri'
require 'json'

# get the number of documents as a command line arg
ARGV.each { |arg| puts "Argument: #{arg}" }
rangeStr = ARGV[0]
nameStr = ARGV[1]
puts rangeStr
puts rangeStr.class
rangeBnds = rangeStr.split("..").map{|d| Integer(d)}
puts rangeBnds[0]
puts rangeBnds[1]
range = Range.new(rangeBnds[0], rangeBnds[1]);
#puts range.to_a

if (ARGV.size != 2) then
    puts "Usage: ruby : #{$PROGRAM_NAME} <doc range> <list name>";
    puts "  where doc range is a ruby style range in quotations, e.g., \"10..20\" ";
    puts "  full example: ruby #{$PROGRAM_NAME} \"10..20\" bub";  
    exit
end

exit

# create pairs
pairs = []
for i in (1..numDocs) do 
    for j in (i+1..numDocs) do
        pairs.push([i, j])
    end
end 
#puts pairs.inspect
#puts pairs.size

# shuffle them 
pairs.shuffle!
#puts pairs.inspect
#puts pairs.size

# add 20% duplicates by finding a random entry and inserting it randomly
dupCt = pairs.size/5 +1
puts "dup count is #{dupCt}."
for i in (1..dupCt) do
    idx = rand(pairs.size) # who to repeat
    #puts "repeating #{idx}"
    pair = pairs[idx].dup # duplicate the array
    pair.reverse! # if the repeat shows up next to the original, this will be good
    #puts "pair is " + pair.inspect
    idx = rand(pairs.size) # where to put the repeat
    #puts "pair is going to #{idx}"
    pairs.insert(idx, pair)
end
puts pairs.inspect
puts pairs.size

obj = { type:"image_compare_list",
        count:pairs.size, 
        list:pairs}
puts obj.inspect
puts obj.to_json

# put the results in the database
dbname = "rop_images/"
docname = name
url = 'http://localhost:5984/' + dbname + docname
uri = URI.parse(url)
 
http = Net::HTTP.new(uri.host, uri.port)
request = Net::HTTP::Put.new(uri.path)

resp = http.request(request, obj.to_json) 
puts resp.body





