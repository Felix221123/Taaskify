
// common function to fetch the data from a url
export async function FetchData(input:RequestInfo, init:ResponseInit | RequestInit) {
  const response = await fetch(input , init);
  if (response.ok){
    return response
  } else {
    const errorBody = await response.json();
    const errorMessage = errorBody.error;
    throw Error(errorMessage);
  }

}


