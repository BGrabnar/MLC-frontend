// gets the query and retuns the list of data from the query
// works when query reutns only one column
export async function getList(reqURL, query)
{
	var list = [];

	// request URL
	var req = reqURL+encodeURIComponent(query)

	await fetch(req).then((data) => data.text())
    .then(data  => {

	  for (let i = 0; i < data.split('<literal>').length; i++)
			{
				list[i] = data.split('<literal>')[i].split('</literal>')[0];
			}
			list.shift();
			list.sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'})); // sort
    })
	.catch("error", (err) => {
		console.log(err)
	})  
	
	return list;
}