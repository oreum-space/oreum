if ( "$(git status --porcelain)" ) {
  echo "Commit changes before update!"
} else {
  oreum "sh /root/oreum.space.update.sh"
}
