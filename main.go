package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

const (
	TargetToken  = "KBTC"
)

type Response struct {
	Hash string
	from string
	to string 
	value string 
}

func main(){
	address := os.Args[1];

	resp , err := http.Get("https://api-ropsten.etherscan.io/api?module=account&action=tokentx&address=" +  address +"&startblock=0&endblock=999999999&sort=asc&apikey=K7ST5DC6VP2Z5ZVWWD1IB3JDB5AHIEV274")
	if err != nil {
		log.Fatalf("Cannot Fetched:" , err)
	}	
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	fmt.Println(body)


	
}