echo "\nGenerating client certificates ..."

echo "ca.crt\n$(<./certs/ca.crt)"

echo "client.key\n$(<./certs/client.key)"

echo "client.crt\n$(<./certs/client.crt)"