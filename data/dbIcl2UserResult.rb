require 'json'
require 'csv'

file = File.read('rop_images_4_27_2015.json')
#file = File.read('/Users/jkc/Documents/retinalImaging/website/data/rop_images_4_27_2015.json')
#file = File.read('/Users/jayashreekalpathy-cramer/Documents/rop/website/Image-Comparator/data/rop_images_4_27_2015.json')
contents = JSON.parse(file)

iclDocs = contents['rows'].select{|x| x['doc']['type'] === "image_compare_list"}

#puts iclDocs

# print the icl names
#iclDocs.each{|x| puts x['key']}



taskRows = contents['rows'].select{|x| x['doc']['type'] === "task"}
tasks = []
taskRows.each{|x| tasks.push(x['doc'])}


# build task to icl map, to look up which icl each result belongs to
task2icl = Hash.new()
tasks.each{|x| task2icl[x['_id']] = x["image_compare_list"]}
#puts task2icl


task2user = Hash.new()
tasks.each{|x| task2user[x['_id']] = x["user"]}
#puts task2user

#puts task2user.invert["susan"]
#puts task2user.find {|key,val| val=="susan"}

# now work on the results
icResultRows = contents['rows'].select{|x| x['doc']['type'] === "imageCompareResult"}

icResults = []
icResultRows.each{|x| icResults.push(x['doc'])}

# sort by task_idx
icResults.sort!{|a,b| a['task_idx'] <=> b['task_idx']}
#puts icResults.class

#puts icResults[0]


output = []
output2=[]

CSV.open("results3.csv", "w") do |csv|
icResults.each do |x|
  #puts "here"
  row = Hash.new()
  #row['task'] = x['task']
  row['task_idx'] = x['task_idx']
  row['image0'] = x['image0'] #.split('/').last
  row['image1'] = x['image1'].split('/').last
  row['winner'] = x['winner']
  row['user'] = x['user']
  row['date']=x['date']
  thisTask=x['task']
  row['icl']=task2icl[thisTask]
  thisLine="#{x['task_idx']}, #{x['image0'].split('/').last}, #{x['image1'].split('/').last}, #{x['winner']}, #{x['user']}, #{x['date']}, #{row['icl']}"
  puts thisLine
  csv << [x['task_idx'], x['image0'].split('/').last, x['image1'].split('/').last, x['winner'], x['user'], x['date'], row['icl']]
  output.push(row)
end
end

#puts output.class

#a=File.open('results1.txt','w')
#a << output
#a.close()
